import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";

export default function ConciergeInquiry() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function sendInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending" || state === "sent") return;

    const form = event.currentTarget;
    const fields = new FormData(form);
    const read = (name: string) => String(fields.get(name) ?? "").trim();
    if (read("bot-field")) {
      setState("sent");
      return;
    }

    setState("sending");
    try {
      if (!supabase) throw new Error("Service indisponible");
      const { error } = await supabase.from("concierge_inquiries").insert({
        full_name: read("nom"),
        email: read("email"),
        phone: read("telephone") || null,
        location: read("localisation"),
        property_type: read("type-logement"),
        message: read("message"),
      });
      if (error) throw error;
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  return (
    <section id="proprietaires" className="booking-panel mb-12" aria-labelledby="owner-title">
      <p className="eyebrow">Propriétaires · Kénitra et région</p>
      <h2 id="owner-title">Confier mon logement</h2>
      <p className="mb-5">Vous louez déjà votre bien ou vous préparez sa mise en location ? Décrivez votre logement et les tâches que vous souhaitez déléguer.</p>
      <p className="mb-5 rounded-lg border border-border bg-secondary px-4 py-3 font-semibold text-secondary-foreground">
        Commission de conciergerie <strong className="text-lg text-primary">20&nbsp;%</strong>
      </p>
      {state === "sent" ? <p role="status">Votre demande a été envoyée. Nous vous répondrons aux coordonnées indiquées.</p> : (
        <form name="demande-conciergerie" method="post" onSubmit={sendInquiry} className="grid gap-4 sm:grid-cols-2">
          <label hidden>Laissez ce champ vide <input name="bot-field" autoComplete="off" /></label>
          <label className="grid gap-2 text-sm">Nom complet<Input name="nom" autoComplete="name" required maxLength={100} /></label>
          <label className="grid gap-2 text-sm">Adresse e-mail<Input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
          <label className="grid gap-2 text-sm">Téléphone (facultatif)<Input name="telephone" type="tel" autoComplete="tel" maxLength={30} /></label>
          <label className="grid gap-2 text-sm">Ville et quartier<Input name="localisation" required maxLength={120} placeholder="Ex. Kénitra, centre-ville" /></label>
          <label className="grid gap-2 text-sm">Type de logement
            <select name="type-logement" required defaultValue="" className="min-h-10 rounded-md border border-input bg-card px-3">
              <option value="" disabled>Choisir un type</option>
              <option>Studio</option><option>Appartement</option><option>Maison ou villa</option><option>Autre</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm sm:col-span-2">Votre projet
            <textarea name="message" required maxLength={2000} rows={4} className="rounded-md border border-input bg-card p-3"
              placeholder="Ex. Je loue un appartement à Mehdia et je cherche de l’aide pour l’accueil et le ménage." />
          </label>
          <p className="text-sm text-muted-foreground sm:col-span-2">Nous utiliserons ces informations pour répondre à votre demande.</p>
          <Button type="submit" disabled={state === "sending"} className="justify-self-start">
            {state === "sending" ? "Envoi en cours…" : "Envoyer ma demande"}
          </Button>
          {state === "error" && <p role="alert" className="text-sm sm:col-span-2">L’envoi a échoué. Réessayez ou écrivez à <a className="underline" href="mailto:contact@centerwarmstay.com">contact@centerwarmstay.com</a>.</p>}
        </form>
      )}
    </section>
  );
}
