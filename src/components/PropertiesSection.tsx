import { rentalPhotoUrl, supabase, type RentalProperty } from "@/lib/supabase";
import BookingDialog from "./BookingDialog";

const examples = [
  { title: "Villa avec piscine", location: "Bir Rami, Kénitra", price: 1200, guests: 8, photo: "photo-1600596542815-ffad4c1539a9" },
  { title: "Studio en centre-ville", location: "Centre-ville, Kénitra", price: 280, guests: 2, photo: "photo-1522708323590-d24dbb6b0267" },
  { title: "Duplex familial", location: "Mimosas, Kénitra", price: 650, guests: 6, photo: "photo-1560448204-e02f11c3d0e2" },
  { title: "Appartement à Mehdya", location: "Mehdya, Kénitra", price: 550, guests: 4, photo: "photo-1493809842364-78817add7ffb" },
  { title: "Riad traditionnel", location: "Ancienne Médina, Kénitra", price: 800, guests: 6, photo: "photo-1600585154340-be6161a56a0c" },
];

export default function PropertiesSection({ rentals = null }: { rentals?: RentalProperty[] | null }) {
  const properties = supabase ? (rentals ?? []).filter((property) => !property.featured).map((property) => ({
    id: property.id,
    title: property.title,
    location: property.location,
    price: Number(property.nightly_price_mad),
    weekendPrice: property.weekend_price_mad === null ? undefined : Number(property.weekend_price_mad),
    guests: property.max_guests,
    image: property.photos[0] ? rentalPhotoUrl(property.photos[0]) : "",
    description: property.description,
  })) : examples.map(({ photo, ...property }) => ({
    ...property, id: undefined, description: "", image: `https://images.unsplash.com/${photo}?w=700&q=80`,
  }));
  if (!properties.length) return <p className="mb-12">{rentals === null ? "Chargement des logements…" : "Aucun autre logement publié pour le moment."}</p>;
  return (
    <div className="stay-list">
      {properties.map((property) => (
        <article className="stay-card" key={property.id ?? property.title}>
          {property.image && <img loading="lazy" src={property.image} alt="" />}
          <div className="stay-card-body">
            <p className="eyebrow">{property.location}</p>
            <h2>{property.title}</h2>
            {property.description && <p className="mb-2">{property.description}</p>}
            <p>Jusqu’à {property.guests} voyageurs</p>
            <div className="stay-card-actions">
              <p><strong>{property.price} MAD</strong> / nuit</p>
              <BookingDialog property={property} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
