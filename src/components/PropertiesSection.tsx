import { motion } from "framer-motion";
import { Star, MapPin, Users, Bed, Bath, Wifi, Car, Wind } from "lucide-react";
import { useState } from "react";

const properties = [
  {
    id: 1,
    title: "Appartement Vue Mer — Marina Kénitra",
    location: "Marina, Kénitra",
    price: 450,
    rating: 4.9,
    reviews: 47,
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
    amenities: ["Wifi", "Parking", "Climatisation"],
    superhost: true,
  },
  {
    id: 2,
    title: "Villa Moderne avec Piscine",
    location: "Bir Rami, Kénitra",
    price: 1200,
    rating: 4.8,
    reviews: 32,
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    amenities: ["Wifi", "Parking", "Climatisation"],
    superhost: true,
  },
  {
    id: 3,
    title: "Studio Cozy Centre-Ville",
    location: "Centre-Ville, Kénitra",
    price: 280,
    rating: 4.7,
    reviews: 63,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    amenities: ["Wifi", "Climatisation"],
    superhost: false,
  },
  {
    id: 4,
    title: "Duplex Familial — Quartier Résidentiel",
    location: "Mimosas, Kénitra",
    price: 650,
    rating: 4.9,
    reviews: 28,
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    amenities: ["Wifi", "Parking", "Climatisation"],
    superhost: true,
  },
  {
    id: 5,
    title: "Appartement Standing Mehdya",
    location: "Mehdya, Kénitra",
    price: 550,
    rating: 4.6,
    reviews: 19,
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
    amenities: ["Wifi", "Parking"],
    superhost: false,
  },
  {
    id: 6,
    title: "Riad Traditionnel Rénové",
    location: "Ancienne Médina, Kénitra",
    price: 800,
    rating: 5.0,
    reviews: 41,
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    amenities: ["Wifi", "Climatisation"],
    superhost: true,
  },
];

const amenityIcons: Record<string, React.ReactNode> = {
  Wifi: <Wifi size={14} />,
  Parking: <Car size={14} />,
  Climatisation: <Wind size={14} />,
};

const PropertyCard = ({ property, index }: { property: typeof properties[0]; index: number }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-card border border-border/50 rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(212,175,55,0.1)]"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={property.image}
          alt={property.title}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
        />
        {!imgLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
        {property.superhost && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            Superhost
          </span>
        )}
        <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
          <Star size={12} className="text-primary fill-primary" />
          {property.rating}
          <span className="text-foreground/50">({property.reviews})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-1 text-foreground/50 text-xs mb-2">
          <MapPin size={12} className="text-primary" />
          {property.location}
        </div>
        <h3 className="font-serif text-lg font-semibold text-foreground mb-3 leading-tight line-clamp-2">
          {property.title}
        </h3>

        {/* Details */}
        <div className="flex items-center gap-4 text-foreground/60 text-xs mb-4">
          <span className="flex items-center gap-1"><Users size={13} /> {property.guests} voyageurs</span>
          <span className="flex items-center gap-1"><Bed size={13} /> {property.bedrooms} ch.</span>
          <span className="flex items-center gap-1"><Bath size={13} /> {property.bathrooms} sdb.</span>
        </div>

        {/* Amenities */}
        <div className="flex items-center gap-2 mb-4">
          {property.amenities.map((a) => (
            <span key={a} className="flex items-center gap-1 text-[11px] text-foreground/50 bg-muted/50 px-2 py-1 rounded-full">
              {amenityIcons[a]} {a}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between border-t border-border/30 pt-4">
          <div>
            <span className="text-2xl font-bold text-primary">{property.price}</span>
            <span className="text-foreground/50 text-sm ml-1">MAD / nuit</span>
          </div>
          <a
            href="#contact"
            className="bg-primary/10 text-primary text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Réserver
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const PropertiesSection = () => {
  return (
    <section id="biens" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-[0.3em]">
            Nos Biens
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-3 mb-5">
            Découvrez nos <span className="text-primary">propriétés</span>
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
            Des logements soigneusement sélectionnés et gérés avec excellence pour offrir 
            une expérience inoubliable à vos voyageurs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="#contact"
            className="inline-block border-2 border-primary text-primary px-8 py-3 font-semibold uppercase tracking-wider text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Confier mon bien
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default PropertiesSection;
