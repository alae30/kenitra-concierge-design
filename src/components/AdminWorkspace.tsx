import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import BookingDashboard from "./BookingDashboard";
import PropertyManager from "./PropertyManager";

export default function AdminWorkspace() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [authorizedUser, setAuthorizedUser] = useState<string | null>(null);
  const [tab, setTab] = useState<"bookings" | "properties">("bookings");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [recovery, setRecovery] = useState(() => new URLSearchParams(window.location.search).get("mode") === "recovery");
  const [requestRecovery, setRequestRecovery] = useState(false);
  const isAdmin = Boolean(session && authorizedUser === session.user.id);

  useEffect(() => {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      setSession(currentSession);
      setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;
  useEffect(() => {
    if (!supabase || !userId) return;
    let active = true;
    void supabase.from("rental_admins").select("user_id").eq("user_id", userId).maybeSingle().then(({ data, error }) => {
      if (!active) return;
      if (!error && data) setAuthorizedUser(userId);
      else setMessage(error ? "Impossible de vérifier les droits administrateur." : "Ce compte ne dispose pas d’un accès administrateur.");
    });
    return () => { active = false; };
  }, [userId]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || busy) return;
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: String(form.get("email")).trim(),
        password: String(form.get("password")),
      });
      if (error) setMessage("Connexion impossible. Vérifie tes identifiants et l’activation du compte.");
    } catch {
      setMessage("Le serveur d’authentification est momentanément inaccessible.");
    } finally {
      setBusy(false);
    }
  }

  async function sendRecovery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || busy) return;
    const email = String(new FormData(event.currentTarget).get("email")).trim();
    const redirectTo = new URL("./gestion.html?mode=recovery", window.location.href).href;
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      setMessage(error
        ? "L’envoi a échoué. Patiente un instant avant de réessayer."
        : "Si le compte existe, tu recevras un lien pour définir ton mot de passe.");
    } catch {
      setMessage("Le service d’envoi est momentanément inaccessible.");
    } finally {
      setBusy(false);
    }
  }

  async function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !isAdmin || !recovery || busy) return;
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    if (password !== form.get("confirmation")) {
      setMessage("Les deux mots de passe doivent être identiques.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setMessage("Le mot de passe n’a pas pu être enregistré. Vérifie sa longueur ou demande un nouveau lien.");
        return;
      }
      window.history.replaceState(null, "", window.location.pathname);
      setRecovery(false);
      setRequestRecovery(false);
      setMessage("Mot de passe enregistré.");
    } catch {
      setMessage("Le serveur d’authentification est momentanément inaccessible.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    setAuthorizedUser(null);
    setMessage("");
    const response = await supabase?.auth.signOut({ scope: "local" });
    if (response?.error) setMessage("La déconnexion n’a pas pu être finalisée. Recharge la page.");
  }

  if (!supabase) return <BookingDashboard />;
  if (!ready) return <p>Vérification de la session…</p>;

  return (
    <div className="booking-dashboard">
      {isAdmin && !recovery ? (
        <>
          <div className="dashboard-note mt-6" aria-label="Navigation de gestion">
            <Button variant={tab === "bookings" ? "default" : "outline"} aria-pressed={tab === "bookings"} onClick={() => setTab("bookings")}>Réservations</Button>
            <Button variant={tab === "properties" ? "default" : "outline"} aria-pressed={tab === "properties"} onClick={() => setTab("properties")}>Logements</Button>
            <Button variant="ghost" onClick={() => void signOut()}>Se déconnecter</Button>
          </div>
          {message && <p role="status" className="dashboard-note">{message}</p>}
          {tab === "bookings" ? <BookingDashboard live /> : <PropertyManager />}
        </>
      ) : (
        <>
          <section className="page-intro"><h1>Espace administrateur</h1></section>
          <section className="dashboard-card max-w-lg">
            {recovery && isAdmin ? (
              <form className="grid gap-4" onSubmit={savePassword}>
                <h2>Définir mon mot de passe</h2>
                <label className="grid gap-1">Nouveau mot de passe<Input name="password" type="password" minLength={12} autoComplete="new-password" required /></label>
                <label className="grid gap-1">Confirmer le mot de passe<Input name="confirmation" type="password" minLength={12} autoComplete="new-password" required /></label>
                <Button disabled={busy}>Enregistrer le mot de passe</Button>
              </form>
            ) : session ? (
              <Button onClick={() => void signOut()}>Se déconnecter</Button>
            ) : requestRecovery || recovery ? (
              <form className="grid gap-4" onSubmit={sendRecovery}>
                <h2>Recevoir un lien</h2>
                {recovery && <p>Ce lien ne permet plus d’ouvrir une session. Demande un nouveau lien.</p>}
                <label className="grid gap-1">E-mail administrateur<Input name="email" type="email" autoComplete="username" required /></label>
                <Button disabled={busy}>{busy ? "Envoi…" : "Envoyer le lien"}</Button>
                <Button type="button" variant="ghost" onClick={() => {
                  window.history.replaceState(null, "", window.location.pathname);
                  setRequestRecovery(false);
                  setRecovery(false);
                  setMessage("");
                }}>Retour à la connexion</Button>
              </form>
            ) : (
              <form className="grid gap-4" onSubmit={signIn}>
                <label className="grid gap-1">E-mail administrateur<Input name="email" type="email" autoComplete="username" required /></label>
                <label className="grid gap-1">Mot de passe<Input name="password" type="password" autoComplete="current-password" required /></label>
                <Button disabled={busy}>{busy ? "Connexion…" : "Se connecter"}</Button>
                <Button type="button" variant="ghost" onClick={() => {
                  setMessage("");
                  setRequestRecovery(true);
                }}>Créer ou réinitialiser mon mot de passe</Button>
              </form>
            )}
            {message && <p role="status" className="mt-4">{message}</p>}
          </section>
        </>
      )}
    </div>
  );
}
