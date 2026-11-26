import { rentalPhotoUrl, supabase, type RentalProperty } from "@/lib/supabase";
import BookingDialog from "./BookingDialog";

export default function PropertiesSection({ rentals = null }: { rentals?: RentalProperty[] | null }) {
  const properties = (rentals ?? []).filter((property) => !property.featured).map((property) => ({
    id: property.id,
    title: property.title,
    location: property.location,
    price: Number(property.nightly_price_mad),
    weekendPrice: property.weekend_price_mad === null ? undefined : Number(property.weekend_price_mad),
    guests: property.max_guests,
    image: property.photos[0] ? rentalPhotoUrl(property.photos[0]) : "",
    description: property.description,
  }));
  if (!properties.length) return <p className="mb-12">{supabase && rentals === null ? "Chargement des logements…" : "Aucun autre logement publié pour le moment."}</p>;
  return (
    <div className="stay-list">
      {properties.map((property) => (
        <article className="stay-card" key={property.id}>
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
