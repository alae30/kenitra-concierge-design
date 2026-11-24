import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, Download, FileText, Inbox, Search, Wallet } from "lucide-react";
import { bookingsChanged, downloadDemoContract, listDemoBookings, saveDemoBooking, type BookingStatus, type DemoBooking } from "@/lib/demo-bookings";
import "./BookingDashboard.css";

const statusNames: Record<BookingStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée",
};

const money = new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD", maximumFractionDigits: 0 });
const calendarDate = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeZone: "UTC" });
const dateLabel = (date: string) => calendarDate.format(new Date(date));

export default function BookingDashboard() {
  const [bookings, setBookings] = useState<DemoBooking[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function refresh() {
      try {
        const rows = await listDemoBookings();
        if (active) setBookings(rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      } catch {
        if (active) setMessage("Impossible de lire les réservations dans ce navigateur.");
      } finally {
        if (active) setLoading(false);
      }
    }
    function onStorage(event: StorageEvent) {
      if (event.key === bookingsChanged) void refresh();
    }
    void refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", onStorage);
    return () => {
      active = false;
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Africa/Casablanca" }).format(new Date());
  const selected = bookings.find(({ id }) => id === selectedId);
  const confirmed = bookings.filter(({ status }) => status === "confirmed");
  const arrivals = confirmed.filter(({ arrival }) => arrival >= today).sort((a, b) => a.arrival.localeCompare(b.arrival));
  const contractCount = bookings.filter(({ contract }) => contract).length;
  const filtered = bookings.filter((booking) => (
    (status === "all" || booking.status === status)
    && [booking.id, booking.guest, booking.email, booking.property].some((value) =>
      value.toLocaleLowerCase("fr").includes(query.trim().toLocaleLowerCase("fr")))
  ));
  const metrics = [
    { label: "Demandes en attente", value: bookings.filter(({ status }) => status === "pending").length, Icon: Inbox },
    { label: "Arrivées à venir", value: arrivals.length, Icon: CalendarDays },
    { label: "Contrats reçus", value: contractCount, Icon: FileText },
    { label: "Montant confirmé", value: money.format(confirmed.reduce((sum, booking) => sum + booking.amount, 0)), Icon: Wallet },
  ];

  async function updateStatus(booking: DemoBooking, nextStatus: BookingStatus) {
    setSaving(true);
    setMessage("");
    try {
      await saveDemoBooking({ ...booking, status: nextStatus });
      setBookings((rows) => rows.map((row) => row.id === booking.id ? { ...row, status: nextStatus } : row));
      setMessage(`Statut mis à jour : ${statusNames[nextStatus].toLowerCase()}.`);
    } catch {
      setMessage("La modification du statut n’a pas pu être enregistrée.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="booking-dashboard">
      <section className="page-intro">
        <p className="eyebrow">Espace de gestion · Démonstration</p>
        <h1>Suivi des réservations</h1>
        <p className="intro">Retrouvez les demandes, les prochaines arrivées et les contrats du studio.</p>
      </section>

      <div className="dashboard-note">
        Les simulations et leurs PDF restent dans ce navigateur. Utilisez des données et des pièces d’identité fictives.
        <a className="stay-contact-link" href="./logement.html#reservation">Tester une réservation</a>
      </div>

      <dl className="dashboard-metrics">
        {metrics.map(({ label, value, Icon }) => (
          <div key={label} className="dashboard-card">
            <Icon aria-hidden="true" size={20} />
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <div className="dashboard-columns">
        <section className="dashboard-card" aria-labelledby="dashboard-requests">
          <h2 id="dashboard-requests">Demandes de réservation</h2>
          <div className="dashboard-filters">
            <label>
              Rechercher
              <span className="dashboard-search"><Search aria-hidden="true" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nom, e-mail ou logement" /></span>
            </label>
            <label>
              Statut
              <select value={status} onChange={(event) => setStatus(event.target.value as BookingStatus | "all")}>
                <option value="all">Tous les statuts</option>
                {Object.entries(statusNames).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </div>

          {loading ? <p>Chargement…</p> : !filtered.length ? (
            <p>{bookings.length ? "Aucune demande ne correspond aux filtres." : "Les demandes simulées apparaîtront ici après la génération du contrat."}</p>
          ) : (
            <ul className="dashboard-rows">
              {filtered.map((booking) => (
                <li key={booking.id}>
                  <button type="button" className="dashboard-row" aria-pressed={selectedId === booking.id} onClick={() => setSelectedId(booking.id)}>
                    <span><strong>{booking.guest}</strong><small>{booking.property} · {dateLabel(booking.arrival)}</small></span>
                    <span className={`dashboard-status is-${booking.status}`}>{statusNames[booking.status]}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="dashboard-sidebar">
          <section className="dashboard-card" aria-labelledby="dashboard-file">
            <h2 id="dashboard-file">Dossier de réservation</h2>
            {selected ? (
              <>
                <dl className="dashboard-details">
                  <div><dt>Voyageur</dt><dd>{selected.guest}<br />{selected.email}</dd></div>
                  <div><dt>Séjour</dt><dd>{dateLabel(selected.arrival)} au {dateLabel(selected.departure)}<br />{selected.guests} voyageur(s)</dd></div>
                  <div><dt>Logement</dt><dd>{selected.property}</dd></div>
                  <div><dt>Montant</dt><dd>{money.format(selected.amount)}</dd></div>
                  <div><dt>Référence</dt><dd>{selected.id.slice(0, 8)}</dd></div>
                </dl>
                <label className="dashboard-status-field">
                  Statut de la demande
                  <select value={selected.status} disabled={saving} onChange={(event) => void updateStatus(selected, event.target.value as BookingStatus)}>
                    {Object.entries(statusNames).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                {selected.contract && <Button type="button" onClick={() => downloadDemoContract(selected)}><Download aria-hidden="true" /> Télécharger le contrat signé</Button>}
              </>
            ) : <p>Sélectionnez une demande pour consulter ses détails et son contrat.</p>}
          </section>
          <section className="dashboard-card" aria-labelledby="dashboard-arrivals">
            <h2 id="dashboard-arrivals">Prochaines arrivées</h2>
            {arrivals.length ? <ul className="dashboard-rows">
              {arrivals.slice(0, 5).map((booking) => <li key={booking.id}>
                <button type="button" className="dashboard-row" onClick={() => setSelectedId(booking.id)}>
                  <span><strong>{booking.guest}</strong><small>{booking.property}</small></span><span>{dateLabel(booking.arrival)}</span>
                </button>
              </li>)}
            </ul> : <p>Aucune arrivée confirmée à venir.</p>}
          </section>
        </div>
      </div>
      {message && <p className="dashboard-note" role="status">{message}</p>}
    </div>
  );
}
