import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { houseRules, houseRulesContact } from "@/lib/house-rules";
import { BookingForm } from "@/components/BookingDialog";
import PropertiesSection from "@/components/PropertiesSection";
import brandMark from "@/assets/center-warm-stay.svg";
import studio from "@/assets/stays/studio.jpg";
import salleEau from "@/assets/stays/salle-eau.jpg";
import coinSalon from "@/assets/stays/coin-salon.jpg";
import evier from "@/assets/stays/evier.jpg";
import coinCafe from "@/assets/stays/coin-cafe.jpg";
import cuisine from "@/assets/stays/cuisine.jpg";
import cuisineSuspensions from "@/assets/stays/cuisine-suspensions.jpg";
import coinTele from "@/assets/stays/coin-tele.jpg";
import chambre from "@/assets/stays/chambre.jpg";

const mainStay = { title: "Center Warm Stay", price: 500, weekendPrice: 700, guests: 2 };
const photos = [
  { src: studio, label: "Vue du studio" },
  { src: cuisine, label: "Cuisine" },
  { src: chambre, label: "Coin nuit" },
  { src: salleEau, label: "Salle d’eau" },
  { src: coinSalon, label: "Coin salon" },
  { src: evier, label: "Évier de cuisine" },
  { src: coinCafe, label: "Coin café" },
  { src: cuisineSuspensions, label: "Vue d’ensemble de la cuisine" },
  { src: coinTele, label: "Coin télé" },
];
const pages = [
  { file: "index.html", label: "Accueil" },
  { file: "logement.html", label: "Logement principal" },
  { file: "conciergerie.html", label: "Conciergerie" },
  { file: "contact.html", label: "Contact" },
];

function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Kénitra, Maroc</p>
          <h1>Un séjour à Kénitra, <em>comme chez soi.</em></h1>
          <p className="intro">Découvrez Center Warm Stay, un studio aménagé pour cuisiner, se détendre et profiter de la ville à votre rythme.</p>
          <a className="stay-button" href="./logement.html">Découvrir le logement</a>
        </div>
        <figure className="hero-photo">
          <img src={studio} alt="Vue du studio Center Warm Stay depuis la cuisine" />
          <img className="hero-detail" src={coinCafe} alt="" />
          <figcaption>Center Warm Stay, Kénitra</figcaption>
        </figure>
      </section>
      <section className="home-links">
        <div>
          <p className="eyebrow">Logement principal</p>
          <h2>Center Warm Stay</h2>
          <p>Studio avec cuisine ouverte, coin salon et espace nuit.</p>
          <a href="./logement.html#reservation">Simuler un séjour</a>
        </div>
        <div>
          <p className="eyebrow">Autres logements</p>
          <h2>La conciergerie</h2>
          <p>Explorez les autres types de séjours proposés dans la démo.</p>
          <a href="./conciergerie.html">Voir les autres logements</a>
        </div>
      </section>
    </>
  );
}

function MainStay() {
  const [selected, setSelected] = useState(0);

  return (
    <>
      <section className="page-intro">
        <p className="eyebrow">Logement principal · Kénitra</p>
        <h1>{mainStay.title}</h1>
        <p className="intro">Un studio cosy avec une cuisine ouverte, un coin salon avec télévision, un lit double et une salle d’eau avec douche.</p>
      </section>
      <div className="stay-detail">
        <div>
          <figure className="detail-photo">
            <img key={photos[selected].src} src={photos[selected].src} alt={photos[selected].label} />
            <figcaption>{photos[selected].label}</figcaption>
          </figure>
          <div className="gallery-options" role="group" aria-label="Galerie de photos">
            {photos.map((photo, index) => (
              <button key={photo.label} type="button" aria-label={`Afficher ${photo.label.toLocaleLowerCase("fr")}`}
                aria-pressed={index === selected} onClick={() => setSelected(index)}>
                <img loading="lazy" src={photo.src} alt="" />
                <span>{photo.label}</span>
              </button>
            ))}
          </div>
        </div>
        <section id="reservation" className="booking-panel" aria-labelledby="booking-title">
          <p className="eyebrow">Réservation · Démonstration</p>
          <h2 id="booking-title">Préparer mon séjour</h2>
          <BookingForm property={mainStay} />
        </section>
      </div>
    </>
  );
}

function Concierge() {
  return (
    <>
      <section className="page-intro">
        <p className="eyebrow">Conciergerie · Kénitra et alentours</p>
        <h1>Autres logements</h1>
        <p className="intro">Parcourez les logements, photos et tarifs d’exemple de cette démonstration.</p>
      </section>
      <PropertiesSection />
    </>
  );
}

const residenceName = "Résidence AL ASSIL COPORATE";
const residenceMapsUrl = "https://maps.app.goo.gl/YCivSV7GvoSj4DfYA?g_st=aw";
const residenceMapEmbed = "https://www.google.com/maps?cid=11764988462535068325&output=embed&hl=fr";
const contactEmail = "contact@centerwarmstay.com";
const contactPhoneHref = `tel:${houseRulesContact.replace(/ /g, "")}`;

function BrandLink() {
  return (
    <a className="stay-brand" href="./index.html" aria-label="Center Warm Stay — Accueil">
      <img src={brandMark} alt="" width={58} height={52} />
      <span className="stay-wordmark"><span>Center</span><small>Warm Stay</small></span>
    </a>
  );
}

function StayAddress() {
  return (
    <address className="not-italic">
      {residenceName}<br />
      7C63+55V · Kénitra 14000, Maroc
    </address>
  );
}

function Contact() {
  return (
    <>
      <section className="page-intro">
        <p className="eyebrow">Center Warm Stay · Kénitra</p>
        <h1>Contact</h1>
        <p className="intro">Une question sur le studio, votre séjour ou la conciergerie ? Écrivez-nous ou appelez-nous.</p>
      </section>
      <div className="stay-contact-grid">
        <section className="booking-panel stay-contact-card">
          <Mail aria-hidden="true" />
          <h2>E-mail</h2>
          <a className="stay-contact-link" href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </section>
        <section className="booking-panel stay-contact-card">
          <Phone aria-hidden="true" />
          <h2>Téléphone</h2>
          <a className="stay-contact-link" href={contactPhoneHref}>{houseRulesContact}</a>
        </section>
        <section className="booking-panel stay-contact-card">
          <MapPin aria-hidden="true" />
          <h2>Adresse</h2>
          <StayAddress />
        </section>
      </div>
      <section className="booking-panel stay-location" aria-labelledby="stay-location-title">
        <div className="stay-location-heading">
          <h2 id="stay-location-title">Localisation</h2>
          <a className="stay-contact-link" href={residenceMapsUrl} target="_blank" rel="noopener noreferrer">
            Ouvrir dans Google Maps
          </a>
        </div>
        <iframe
          className="stay-location-map"
          title={`Carte Google Maps de la ${residenceName}`}
          src={residenceMapEmbed}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </section>
    </>
  );
}

function HouseRules() {
  return (
    <>
      <section className="page-intro">
        <p className="eyebrow">Center Warm Stay · Kénitra</p>
        <h1>Règlement du logement</h1>
      </section>
      <section className="booking-panel mb-12 max-w-3xl" aria-label="Conditions générales du séjour">
        <ol className="list-decimal space-y-5 pl-6">
          {houseRules.map((rule) => (
            <li key={rule.title}>
              <h2 className="!mb-1 !text-xl">{rule.title}</h2>
              <p>{rule.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6">Pour un besoin spécifique, contacte le <a className="underline" href={contactPhoneHref}>{houseRulesContact}</a>.</p>
      </section>
    </>
  );
}

export default function App() {
  const filename = window.location.pathname.split("/").pop();
  const rulesPage = filename === "reglement.html";
  const page = pages.find(({ file }) => file === filename) ?? (rulesPage ? undefined : pages[0]);

  return (
    <TooltipProvider>
      <header className="stay-header">
        <div className="stay-shell header-inner">
          <BrandLink />
          <nav aria-label="Navigation principale">
            {pages.map(({ file, label }) => (
              <a key={file} href={`./${file}`} aria-current={file === page?.file ? "page" : undefined}>{label}</a>
            ))}
          </nav>
        </div>
      </header>
      <main className="stay-shell">
        {rulesPage ? <HouseRules /> : page?.file === "logement.html" ? <MainStay /> : page?.file === "conciergerie.html" ? <Concierge /> : page?.file === "contact.html" ? <Contact /> : <Home />}
      </main>
      <footer className="stay-footer">
        <div className="stay-shell">
          <BrandLink />
          <StayAddress />
        </div>
      </footer>
    </TooltipProvider>
  );
}
