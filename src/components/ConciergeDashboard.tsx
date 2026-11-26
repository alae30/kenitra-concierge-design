import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const statuses = { new: "Nouvelle", contacted: "Contactée", closed: "Clôturée" } as const;
type InquiryStatus = keyof typeof statuses;
type Inquiry = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  location: string;
  property_type: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
};

const dateFormat = new Intl.DateTimeFormat("fr-MA", {
  dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Casablanca",
});

export default function ConciergeDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<InquiryStatus | "all">("all");
  const [revision, refresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    void supabase.from("concierge_inquiries")
      .select("id, full_name, email, phone, location, property_type, message, status, created_at")
      .order("created_at", { ascending: false }).order("id", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setFeedback("Impossible de charger les demandes.");
        else setInquiries(data as Inquiry[]);
        setLoading(false);
      });
    return () => { active = false; };
  }, [revision]);

  async function changeStatus(inquiry: Inquiry, status: InquiryStatus) {
    if (!supabase || saving || loading) return;
    setSaving(true);
    setFeedback("");
    try {
      const { data, error } = await supabase.from("concierge_inquiries").update({ status })
        .eq("id", inquiry.id).eq("status", inquiry.status).select("id").maybeSingle();
      if (error || !data) throw error ?? new Error("Statut modifié");
      setInquiries((rows) => rows.map((row) => row.id === inquiry.id ? { ...row, status } : row));
      setFeedback("Statut mis à jour.");
    } catch {
      setFeedback("Le statut n’a pas pu être modifié. Actualisez les demandes puis réessayez.");
    } finally {
      setSaving(false);
    }
  }

  const visible = inquiries.filter((inquiry) => filter === "all" || inquiry.status === filter);

  return (
    <section className="booking-panel" aria-labelledby="concierge-dashboard-title">
      <h2 id="concierge-dashboard-title">Demandes de conciergerie</h2>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-sm">Filtrer par statut
          <select value={filter} onChange={(event) => setFilter(event.target.value as InquiryStatus | "all")} className="min-h-10 rounded-md border bg-card px-3">
            <option value="all">Toutes les demandes</option>
            {Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <Button variant="outline" disabled={loading || saving} onClick={() => {
          setFeedback("");
          setLoading(true);
          refresh((value) => value + 1);
        }}>Actualiser</Button>
      </div>
      {feedback && <p role="status" className="mb-4">{feedback}</p>}
      {loading && <p>Chargement des demandes…</p>}
      {!loading && !feedback && !visible.length && <p>Aucune demande pour ce filtre.</p>}
      <ul className="grid gap-3">
        {visible.map((inquiry) => (
          <li className="rounded-lg border bg-background p-4" key={inquiry.id}>
            <h3 className="break-words font-semibold">{inquiry.full_name}</h3>
            <p className="break-words">{inquiry.property_type} · {inquiry.location}</p>
            <p className="text-sm text-muted-foreground">{dateFormat.format(new Date(inquiry.created_at))}</p>
            <p className="my-3 whitespace-pre-wrap break-words">{inquiry.message}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <a className="break-all underline" href={`mailto:${encodeURIComponent(inquiry.email)}`}>{inquiry.email}</a>
              {inquiry.phone && <a className="underline" href={`tel:${inquiry.phone.replace(/[^+0-9]/g, "")}`}>{inquiry.phone}</a>}
            </div>
            <label className="mt-3 grid max-w-52 gap-1 text-sm">Statut de la demande
              <select value={inquiry.status} disabled={saving || loading}
                onChange={(event) => void changeStatus(inquiry, event.target.value as InquiryStatus)}
                className="min-h-10 rounded-md border bg-card px-3">
                {Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
