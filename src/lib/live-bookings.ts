import { downloadDemoContract, type BookingStatus, type DemoBooking } from "./demo-bookings";
import type { ContractImage } from "./booking-contract";
import { supabase } from "./supabase";

export type LiveBooking = DemoBooking & { contractPath?: string };

export async function listLiveBookings(): Promise<LiveBooking[]> {
  if (!supabase) throw new Error("Supabase indisponible");
  const { data, error } = await supabase.from("rental_bookings")
    .select("id, arrival, departure, guests, guest_name, guest_email, total_mad, status, created_at, contract_path, rental_properties(title)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map((row) => ({
    id: row.id,
    property: (row.rental_properties as unknown as { title: string } | null)?.title ?? "Logement",
    guest: row.guest_name, email: row.guest_email, arrival: row.arrival, departure: row.departure,
    guests: row.guests, amount: Number(row.total_mad), status: row.status as BookingStatus,
    createdAt: row.created_at, contractPath: row.contract_path ?? undefined,
  }));
}

export async function updateLiveStatus(booking: LiveBooking, status: BookingStatus) {
  if (!supabase) throw new Error("Supabase indisponible");
  const { data, error } = await supabase.from("rental_bookings").update({ status })
    .eq("id", booking.id).eq("status", booking.status).select("id").maybeSingle();
  if (error?.code === "23P01") throw new Error("Ce logement est déjà confirmé sur des dates qui se chevauchent.");
  if (error || !data) throw new Error("Le statut a pu changer entre-temps. Actualise le tableau de bord.");
}

export async function downloadLiveContract(booking: LiveBooking) {
  if (!supabase || !booking.contractPath) return;
  const { data, error } = await supabase.storage.from("rental-agreements").download(booking.contractPath);
  if (error) throw error;
  downloadDemoContract({ ...booking, contract: data });
}

export async function submitLiveBooking(booking: DemoBooking, propertyId: string, recto: ContractImage, verso: ContractImage, signature: string) {
  if (!supabase) throw new Error("Supabase indisponible");
  const body = new FormData();
  for (const [name, value] of Object.entries({
    id: booking.id, property: propertyId, name: booking.guest, email: booking.email,
    arrival: booking.arrival, departure: booking.departure, guests: booking.guests,
    amount: booking.amount, accepted: "yes",
  })) body.append(name, String(value));
  for (const [name, value] of Object.entries({ recto: recto.data, verso: verso.data, signature })) {
    if (typeof value !== "string" || !value.startsWith("data:image/")) throw new Error("Image de contrat illisible.");
    body.append(name, await (await fetch(value)).blob(), name);
  }
  const anonJwt = import.meta.env.VITE_SUPABASE_FUNCTION_ANON_JWT;
  if (!anonJwt) throw new Error("La réception des réservations en ligne n’est pas encore activée.");
  const { data, error } = await supabase.functions.invoke<Blob>("reservation-request", {
    body,
    headers: { Authorization: `Bearer ${anonJwt}` },
  });
  if (error) {
    const result = await error.context?.json().catch(() => null);
    throw new Error(result?.error ?? "La réservation n’a pas pu être transmise. Réessaie dans un instant.");
  }
  if (!(data instanceof Blob)) throw new Error("Contrat indisponible.");
  return data;
}
