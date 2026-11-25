import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { downloadDemoContract, saveDemoBooking } from "@/lib/demo-bookings";
import { demoTerms } from "@/lib/house-rules";
const dayMilliseconds = 86_400_000;
const money = new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" });

type Property = { id?: string; title: string; price: number; weekendPrice?: number; guests: number };

function IdentityPhoto({ side }: { side: "Recto" | "Verso" }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <label className="grid gap-2 text-sm">
      {side}
      <Input name={side.toLowerCase()} type="file" required accept="image/jpeg,image/png" capture="environment" onChange={(event) => {
        const image = event.target.files?.[0];
        if (image && (!["image/jpeg", "image/png"].includes(image.type) || image.size > 5 * 1024 * 1024)) {
          event.target.value = "";
          setFile(null);
          setError("Choisis une image JPEG ou PNG de 5 Mo maximum.");
          return;
        }
        setError("");
        setFile(image ?? null);
      }} />
      {error && <span role="alert">{error}</span>}
      {preview && <img className="h-24 w-full rounded-md object-contain bg-muted" src={preview} alt={`Aperçu du ${side.toLowerCase()}`} />}
    </label>
  );
}

export function BookingForm({ property }: { property: Property }) {
  const live = Boolean(property.id);
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [signed, setSigned] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("");
  const canvas = useRef<HTMLCanvasElement>(null);
  const pointer = useRef<number | null>(null);
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Africa/Casablanca" }).format(new Date());
  const start = Date.parse(arrival);
  const end = Date.parse(departure);
  const nights = (end - start) / dayMilliseconds;
  let weekendNights = 0;
  for (let day = start; day < end; day += dayMilliseconds) {
    const weekday = new Date(day).getUTCDay();
    if (weekday === 0 || weekday === 6) weekendNights++;
  }
  const amount = (nights - weekendNights) * property.price
    + weekendNights * (property.weekendPrice ?? property.price);
  const total = nights > 0 ? money.format(amount) : null;

  function draw(event: PointerEvent<HTMLCanvasElement>, start = false) {
    if (start) {
      if (pointer.current !== null || event.button !== 0) return;
      pointer.current = event.pointerId;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (pointer.current !== event.pointerId) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) * event.currentTarget.width / bounds.width;
    const y = (event.clientY - bounds.top) * event.currentTarget.height / bounds.height;
    const context = event.currentTarget.getContext("2d");
    if (!context) return;
    context.strokeStyle = "#171717";
    context.lineWidth = 4;
    context.lineCap = "round";
    context.lineJoin = "round";
    if (start) {
      context.beginPath();
      context.moveTo(x, y);
      return;
    }
    context.lineTo(x, y);
    context.stroke();
    setSigned(true);
  }

  function endStroke(event: PointerEvent<HTMLCanvasElement>) {
    if (pointer.current === event.pointerId) pointer.current = null;
  }

  async function download(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (generating || submitted) return;
    if (!signed || !canvas.current || !total || arrival < today) {
      setStatus("Vérifie les dates et trace ta signature avant de continuer.");
      return;
    }
    const data = new FormData(event.currentTarget);
    const recto = data.get("recto");
    const verso = data.get("verso");
    if (!(recto instanceof File) || !(verso instanceof File) || !recto.size || !verso.size) {
      setStatus("Ajoute une image pour le recto et une autre pour le verso.");
      return;
    }
    const signature = canvas.current.toDataURL("image/png");
    setGenerating(true);
    setStatus("");
    try {
      const { createBookingContract, readContractPhoto } = await import("@/lib/booking-contract");
      const [frontImage, backImage] = await Promise.all([readContractPhoto(recto), readContractPhoto(verso)]);
      const booking = {
        id: crypto.randomUUID(),
        property: property.title,
        guest: String(data.get("name")),
        email: String(data.get("email")),
        arrival,
        departure,
        guests: Number(data.get("guests")),
        amount,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
      };
      if (property.id) {
        const { submitLiveBooking } = await import("@/lib/live-bookings");
        try {
          const contract = await submitLiveBooking(booking, property.id, frontImage, backImage, signature);
          downloadDemoContract({ ...booking, contract });
          setStatus("Demande envoyée. Le séjour reste en attente de confirmation.");
          setSubmitted(true);
        } catch (error) {
          setStatus(error instanceof Error ? error.message : "La demande n’a pas pu être envoyée.");
        }
        return;
      }
      const pdf = createBookingContract({
        details: [
          property.title,
          `Dates : du ${arrival} au ${departure}`,
          `Voyageurs : ${data.get("guests")}`,
          `Montant indicatif : ${total.replace(/\s/g, " ")}`,
          `Nom : ${data.get("name")}`,
          `E-mail : ${data.get("email")}`,
        ],
        signedAt: new Date().toLocaleString("fr-MA", { timeZone: "Africa/Casablanca" }).replace(/\s/g, " "),
        recto: frontImage,
        verso: backImage,
        signature,
      });
      pdf.save("contrat-sejour-demonstration.pdf");
      try {
        await saveDemoBooking({ ...booking, contract: pdf.output("blob") });
        setStatus("Le contrat a été téléchargé et la demande figure dans le tableau de bord de ce navigateur.");
      } catch {
        setStatus("Le contrat a été téléchargé. Le navigateur n’a pas pu enregistrer la demande dans le tableau de bord.");
      }
    } catch {
      setStatus("Le contrat n’a pas pu être généré. Vérifie que les deux images s’ouvrent et réessaie.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <form className="booking-form grid min-w-0 gap-5" onSubmit={download}>
      {property.weekendPrice !== undefined && (
        <p className="text-sm text-muted-foreground">
          {property.price} MAD par nuit du lundi au vendredi · {property.weekendPrice} MAD le samedi et le dimanche
        </p>
      )}
      <div className="grid gap-3 min-[480px]:grid-cols-2">
        <label className="grid gap-2 text-sm">Arrivée<Input type="date" required min={today} value={arrival} onChange={(event) => setArrival(event.target.value)} /></label>
        <label className="grid gap-2 text-sm">Départ<Input type="date" required min={arrival || today} value={departure} onChange={(event) => setDeparture(event.target.value)} /></label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">Voyageurs<Input name="guests" type="number" min={1} max={property.guests} defaultValue={1} required /></label>
        <output className="self-end pb-2 text-sm" aria-live="polite">{total ? `${nights} ${nights === 1 ? 'nuit' : 'nuits'} · ${total}` : `${money.format(property.price)} / nuit`}</output>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">{live ? "Nom complet" : "Nom fictif"}<Input name="name" required maxLength={100} placeholder="Camille Exemple" /></label>
        <label className="grid gap-2 text-sm">{live ? "E-mail" : "E-mail fictif"}<Input name="email" type="email" required maxLength={254} placeholder="camille@example.com" /></label>
      </div>
      <fieldset className="grid min-w-0 gap-2 rounded-lg border p-3">
        <legend className="px-1 text-sm font-semibold">Carte d’identité marocaine</legend>
        <p className="text-sm text-muted-foreground">{live ? "Les images seront incluses au contrat, accessible à la conciergerie dans son espace administrateur." : "Utilise deux images fictives. Elles seront intégrées au contrat PDF téléchargé sur cet appareil."}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <IdentityPhoto side="Recto" />
          <IdentityPhoto side="Verso" />
        </div>
      </fieldset>
      <fieldset className="grid min-w-0 gap-3 rounded-lg border p-3">
        <legend className="px-1 text-sm font-semibold">Conditions et signature</legend>
        <p className="text-sm text-muted-foreground">{live ? "Envoie ta demande de séjour après avoir lu le règlement. La confirmation viendra après vérification." : demoTerms}</p>
        <div className="grid gap-2">
          <a href="./reglement.html" target="_blank" rel="noopener" className="text-sm font-semibold text-primary underline underline-offset-4">
            Lire le règlement du logement
          </a>
          <label className="flex items-start gap-2 text-sm">
            <input className="mt-1" type="checkbox" required />J’accepte le règlement du logement.
          </label>
        </div>
        <p id="signature-instructions" className="text-sm">Signe avec ton doigt, un stylet ou la souris.</p>
        <canvas ref={canvas} width={640} height={200} aria-label="Zone de signature" aria-describedby="signature-instructions"
          className="w-full touch-none rounded-md border bg-white"
          onPointerDown={(event) => draw(event, true)} onPointerMove={(event) => draw(event)}
          onPointerUp={endStroke} onPointerCancel={endStroke} onLostPointerCapture={endStroke}
        />
        <Button type="button" variant="outline" className="justify-self-start" onClick={() => {
          const surface = canvas.current;
          surface?.getContext("2d")?.clearRect(0, 0, surface.width, surface.height);
          setSigned(false);
        }}>Effacer la signature</Button>
      </fieldset>
      <Button disabled={generating || submitted} type="submit">{generating ? "Génération du PDF…" : live ? "Envoyer la demande et télécharger le contrat" : "Télécharger le contrat PDF"}</Button>
      {status && <p role="status" className="text-sm">{status}</p>}
    </form>
  );
}

export default function BookingDialog({ property }: { property: Property }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">Essayer la réservation</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-xl p-4 sm:max-w-2xl sm:p-6">
        <DialogHeader>
          <DialogTitle>{property.title}</DialogTitle>
          <DialogDescription>{property.id ? "Demande de réservation soumise à confirmation." : "Démo de réservation avec un logement et des tarifs d’exemple."}</DialogDescription>
        </DialogHeader>
        <BookingForm property={property} />
      </DialogContent>
    </Dialog>
  );
}
