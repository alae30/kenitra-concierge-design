import { createClient } from "npm:@supabase/supabase-js@2.119.2";
import { jsPDF } from "jspdf";
import { createBookingContract } from "../../../src/lib/booking-contract.ts";
import { houseRules, houseRulesVersion } from "../../../src/lib/house-rules.ts";

const origin = Deno.env.get("BOOKING_SITE_ORIGIN");
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const projectUrl = Deno.env.get("SUPABASE_URL");
const client = projectUrl && serviceKey ? createClient(projectUrl, serviceKey, { auth: { persistSession: false } }) : null;
const dayMillis = 86_400_000;

function dateValue(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const date = new Date(value + "T00:00:00Z");
  return Number.isFinite(+date) && date.toISOString().slice(0, 10) === value ? +date : NaN;
}

Deno.serve(async (request) => {
  const requestOrigin = request.headers.get("origin");
  const headers = new Headers({ "Content-Type": "application/json", "Vary": "Origin", "Cache-Control": "no-store" });
  const reply = (status: number, content: object) => new Response(JSON.stringify(content), { status, headers });
  if (!origin || !client) return reply(503, { error: "Les réservations en ligne ne sont pas encore ouvertes." });
  if (requestOrigin !== origin) return reply(403, { error: "Origine non autorisée." });
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "authorization, apikey, content-type, x-client-info");
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "POST") return reply(405, { error: "Méthode non autorisée." });
  if (Number(request.headers.get("content-length")) > 5_400_000) return reply(413, { error: "Contrat trop volumineux." });

  try {
    // Read a bounded request body before parsing multipart fields.
    const body = request.body?.getReader();
    if (!body) return reply(400, { error: "Demande vide." });
    const chunks: ArrayBuffer[] = [];
    let size = 0;
    for (;;) {
      const { done, value } = await body.read();
      if (done) break;
      size += value.byteLength;
      if (size > 5_400_000) {
        await body.cancel();
        return reply(413, { error: "Contrat trop volumineux." });
      }
      chunks.push(new Uint8Array(value).buffer);
    }
    const data = await new Response(new Blob(chunks), { headers: { "Content-Type": request.headers.get("content-type") ?? "" } }).formData();
    const read = (key: string) => typeof data.get(key) === "string" ? String(data.get(key)).trim() : "";
    const id = read("id");
    const propertyId = read("property");
    const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
    const arrival = read("arrival");
    const departure = read("departure");
    const guests = Number(read("guests"));
    const firstName = read("firstName");
    const lastName = read("lastName");
    const phone = read("phone");
    const phoneDigits = phone.replace(/\D/g, "");
    const name = `${firstName} ${lastName}`;
    const email = read("email").toLowerCase();
    const total = Number(read("amount"));
    const recto = data.get("recto");
    const verso = data.get("verso");
    const signature = data.get("signature");
    const jpeg = (file: FormDataEntryValue | null): file is File =>
      file instanceof File && file.type === "image/jpeg" && file.size > 10 && file.size <= 1_800_000;
    const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Africa/Casablanca" }).format(new Date());
    const start = dateValue(arrival);
    const end = dateValue(departure);
    const nights = (end - start) / dayMillis;
    if (!uuid.test(id) || !uuid.test(propertyId) || !firstName || firstName.length > 100 || !lastName || lastName.length > 100 || email.length > 254 ||
      phone.length > 30 || !/^\+?[0-9 ().-]+$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !Number.isInteger(guests) || guests < 1 ||
      arrival < today || !(nights >= 1 && nights <= 365) || read("accepted") !== "yes" ||
      !jpeg(recto) || !jpeg(verso) || !(signature instanceof File) ||
      signature.type !== "image/png" || signature.size < 25 || signature.size > 600_000) {
      return reply(400, { error: "Vérifie les dates, les coordonnées et le contrat." });
    }
    const { data: property, error: propertyError } = await client.from("rental_properties")
      .select("title, nightly_price_mad, weekend_price_mad, max_guests").eq("id", propertyId).eq("published", true).maybeSingle();
    if (propertyError) return reply(503, { error: "Disponibilité momentanément indisponible." });
    if (!property || guests > property.max_guests) return reply(400, { error: "Logement indisponible ou capacité dépassée." });
    let amount = 0;
    for (let day = start; day < end; day += dayMillis) {
      const weekday = new Date(day).getUTCDay();
      const rate = (weekday === 0 || weekday === 6) ? property.weekend_price_mad ?? property.nightly_price_mad : property.nightly_price_mad;
      amount += Math.round(Number(rate) * 100);
    }
    if (Math.round(total * 100) !== amount) return reply(409, { error: "Le tarif a changé. Recharge la fiche avant de réessayer." });

    const { data: overlapping, error: overlapError } = await client.from("rental_bookings")
      .select("id").eq("property_id", propertyId).eq("status", "confirmed").lt("arrival", departure).gt("departure", arrival).limit(1);
    if (overlapError) return reply(503, { error: "Disponibilité momentanément indisponible." });
    if (overlapping.length) return reply(409, { error: "Ce logement est déjà réservé à ces dates." });

    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: limitError } = await client.from("rental_bookings").select("id", { count: "exact", head: true })
      .eq("guest_email", email).gte("created_at", since);
    if (limitError) return reply(503, { error: "La demande ne peut pas être envoyée pour le moment." });
    if ((count ?? 0) >= 3) return reply(429, { error: "Trop de demandes récentes pour cette adresse e-mail." });

    const [front, back, signing] = await Promise.all([recto, verso, signature].map(async (file) => new Uint8Array(await file.arrayBuffer())));
    const isJpeg = (image: Uint8Array) => image[0] === 255 && image[1] === 216 && image[2] === 255;
    const pngMarker = [137, 80, 78, 71, 13, 10, 26, 10];
    const signatureHeader = new DataView(signing.buffer);
    if (!isJpeg(front) || !isJpeg(back) || !pngMarker.every((byte, index) => signing[index] === byte) ||
      signatureHeader.getUint32(16) !== 640 || signatureHeader.getUint32(20) !== 200) {
      return reply(400, { error: "Les images du contrat sont illisibles." });
    }
    const imageInfo = new jsPDF();
    const photo = (image: Uint8Array) => {
      const { width, height } = imageInfo.getImageProperties(image);
      if (!(width > 0 && height > 0 && width <= 1800 && height <= 1800)) throw new Error("Dimensions de photo invalides");
      return { data: image, width, height };
    };
    const signedAt = new Date();
    const pdf = createBookingContract({
      live: true,
      details: [property.title, `Dates : du ${arrival} au ${departure}`, `Voyageurs : ${guests}`,
        `Montant du séjour : ${(amount / 100).toFixed(2)} MAD`, `Nom : ${lastName}`, `Prénom : ${firstName}`, `Téléphone : ${phone}`, `E-mail : ${email}`],
      signedAt: signedAt.toLocaleString("fr-MA", { timeZone: "Africa/Casablanca" }).replace(/\s/g, " "),
      recto: photo(front), verso: photo(back), signature: signing,
    });
    const contract = pdf.output("arraybuffer");
    const path = `${id}/contrat.pdf`;
    const { error: uploadError } = await client.storage.from("rental-agreements").upload(path, contract, { contentType: "application/pdf" });
    if (uploadError) return reply(503, { error: "Le contrat ne peut pas être enregistré pour le moment." });
    const { error: insertError } = await client.from("rental_bookings").insert({
      id, property_id: propertyId, arrival, departure, guests, guest_name: name, guest_email: email,
      guest_first_name: firstName, guest_last_name: lastName, guest_phone: phone,
      total_mad: amount / 100, terms_version: houseRulesVersion,
      terms_text: houseRules.map(({ title, text }) => `${title}\n${text}`).join("\n\n"),
      signed_at: signedAt.toISOString(), contract_path: path,
    });
    if (insertError) {
      await client.storage.from("rental-agreements").remove([path]);
      return reply(503, { error: "La demande n’a pas pu être enregistrée." });
    }
    headers.set("Content-Type", "application/octet-stream");
    return new Response(contract, { status: 201, headers });
  } catch {
    return reply(400, { error: "La demande ou le contrat est illisible." });
  }
});
