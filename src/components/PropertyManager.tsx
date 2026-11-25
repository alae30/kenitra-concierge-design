import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { rentalPhotoUrl, supabase, type RentalProperty } from "@/lib/supabase";

const acceptedTypes: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export default function PropertyManager() {
  const [properties, setProperties] = useState<RentalProperty[]>([]);
  const [selected, setSelected] = useState<RentalProperty | null>();
  const [photos, setPhotos] = useState<string[]>([]);
  const [version, setVersion] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    void supabase?.from("rental_properties").select("*").order("title").then(({ data, error }) => {
      if (!active) return;
      if (error) setMessage("Les logements n’ont pas pu être chargés.");
      else setProperties(data as RentalProperty[]);
    });
    return () => { active = false; };
  }, []);

  function edit(property: RentalProperty | null | undefined) {
    setSelected(property);
    setPhotos(property?.photos ?? []);
    setMessage("");
    setVersion((value) => value + 1);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || saving || selected === undefined) return;
    const api = supabase;
    const form = new FormData(event.currentTarget);
    const id = selected?.id ?? crypto.randomUUID();
    const added: string[] = [];
    let saved = false;
    const files = form.getAll("photos").filter((file): file is File => file instanceof File && file.size > 0);
    const title = String(form.get("title")).trim();
    const location = String(form.get("location")).trim();
    if (!title || !location || photos.length + files.length > 24 || files.some((file) => !acceptedTypes[file.type] || file.size > 5_242_880)) {
      setMessage("Vérifie le titre, la localisation et les photos : 24 au maximum, JPEG, PNG ou WebP, 5 Mo par fichier.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      for (const file of files) {
        const path = `${id}/${crypto.randomUUID()}.${acceptedTypes[file.type]}`;
        const { error } = await api.storage.from("rental-photos").upload(path, file, { contentType: file.type, cacheControl: "31536000" });
        if (error) throw error;
        added.push(path);
      }
      const values = {
        id, title, location,
        description: String(form.get("description")).trim(),
        nightly_price_mad: Number(form.get("price")),
        weekend_price_mad: form.get("weekend") ? Number(form.get("weekend")) : null,
        max_guests: Number(form.get("guests")),
        published: form.has("published"),
        photos: [...photos, ...added],
        updated_at: new Date().toISOString(),
      };
      const request = selected
        ? api.from("rental_properties").update(values).eq("id", id).eq("updated_at", selected.updated_at)
        : api.from("rental_properties").insert(values);
      const { data, error } = await request.select().maybeSingle();
      if (error || !data) throw error ?? new Error("Conflit de modification");
      const property = data as RentalProperty;
      saved = true;
      setProperties((rows) => [...rows.filter((row) => row.id !== id), property].sort((a, b) => a.title.localeCompare(b.title)));
      edit(property);
      const removed = selected?.photos.filter((path) => !property.photos.includes(path)) ?? [];
      const cleanup = removed.length ? await api.storage.from("rental-photos").remove(removed) : null;
      setMessage(cleanup?.error ? "Logement enregistré. Les anciennes photos n’ont pas pu être supprimées du stockage." : "Logement enregistré.");
    } catch {
      if (!saved && added.length) await api.storage.from("rental-photos").remove(added).catch(() => undefined);
      setMessage(saved
        ? "Logement enregistré. Les anciennes photos n’ont pas pu être supprimées du stockage."
        : "Le logement n’a pas pu être enregistré. Recharge la page si une autre modification a été faite.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dashboard-columns">
      <section className="dashboard-card">
        <h2>Logements</h2>
        <Button onClick={() => edit(null)} disabled={saving}>Ajouter un logement</Button>
        <ul className="dashboard-rows mt-4">
          {properties.map((property) => (
            <li key={property.id}>
              <button type="button" className="dashboard-row" aria-pressed={selected?.id === property.id} disabled={saving} onClick={() => edit(property)}>
                <span><strong>{property.title}</strong><small>{property.featured ? "Logement principal · " : ""}{property.location} · {property.nightly_price_mad} MAD/nuit</small></span>
                <span>{property.published ? "Publié" : "Brouillon"}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className="dashboard-card">
        <h2>{selected === undefined ? "Fiche logement" : selected?.featured ? "Modifier le logement principal" : selected ? "Modifier le logement" : "Ajouter un autre logement"}</h2>
        {selected === undefined ? (
          <p>Choisis un logement à modifier ou clique sur « Ajouter un logement » pour créer une nouvelle fiche.</p>
        ) : (
        <>
        <form key={version} className="grid gap-4" onSubmit={save}>
          <label className="grid gap-1">Nom<Input name="title" required maxLength={100} defaultValue={selected?.title} /></label>
          <label className="grid gap-1">Localisation<Input name="location" required maxLength={180} defaultValue={selected?.location} /></label>
          <label className="grid gap-1">Description<textarea name="description" maxLength={2000} rows={4} className="rounded-md border p-2" defaultValue={selected?.description} /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">Prix par nuit (MAD)<Input name="price" type="number" min="1" max="999999" step="0.01" required defaultValue={selected?.nightly_price_mad} /></label>
            <label className="grid gap-1">Prix week-end (MAD)<Input name="weekend" type="number" min="1" max="999999" step="0.01" defaultValue={selected?.weekend_price_mad ?? ""} /></label>
          </div>
          <label className="grid gap-1">Capacité<Input name="guests" type="number" min="1" max="100" required defaultValue={selected?.max_guests ?? 2} /></label>
          {photos.length > 0 && <ul className="grid grid-cols-2 gap-2">
            {photos.map((path, index) => <li key={path}>
              <img src={rentalPhotoUrl(path)} alt={`Photo ${index + 1}`} className="h-24 w-full rounded object-cover" />
              <Button type="button" variant="outline" size="sm" disabled={saving} onClick={() => setPhotos((items) => items.filter((item) => item !== path))}>Retirer</Button>
            </li>)}
          </ul>}
          <label className="grid gap-1">Ajouter des photos<Input name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple /></label>
          <label className="flex gap-2"><input type="checkbox" name="published" defaultChecked={selected?.published} /> Publier sur le site</label>
          <div className="flex flex-wrap gap-2">
            <Button disabled={saving}>{saving ? "Enregistrement…" : selected ? "Enregistrer les modifications" : "Créer le logement"}</Button>
            <Button type="button" variant="outline" disabled={saving} onClick={() => edit(undefined)}>Fermer la fiche</Button>
          </div>
        </form>
        </>
        )}
        {message && <p role="status" className="mt-3">{message}</p>}
      </section>
    </div>
  );
}
