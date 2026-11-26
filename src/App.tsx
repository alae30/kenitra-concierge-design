import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { houseRules, houseRulesContact } from "@/lib/house-rules";
import { getPublishedProperties, rentalPhotoUrl, supabase, type RentalProperty } from "@/lib/supabase";
import { BookingForm } from "@/components/BookingDialog";
import ConciergeInquiry from "@/components/ConciergeInquiry";
import PropertiesSection from "@/components/PropertiesSection";
import brandMark from "@/assets/center-warm-stay.svg";
import studio from "@/assets/stays/studio.webp";
import studioThumb from "@/assets/stays/studio-mini.webp";
import salleEau from "@/assets/stays/salle-eau.webp";
import salleEauThumb from "@/assets/stays/salle-eau-mini.webp";
import coinSalon from "@/assets/stays/coin-salon.webp";
import coinSalonThumb from "@/assets/stays/coin-salon-mini.webp";
import evier from "@/assets/stays/evier.webp";
import evierThumb from "@/assets/stays/evier-mini.webp";
import coinCafe from "@/assets/stays/coin-cafe.webp";
import coinCafeThumb from "@/assets/stays/coin-cafe-mini.webp";
import cuisine from "@/assets/stays/cuisine.webp";
import cuisineThumb from "@/assets/stays/cuisine-mini.webp";
import cuisineSuspensions from "@/assets/stays/cuisine-suspensions.webp";
import cuisineSuspensionsThumb from "@/assets/stays/cuisine-suspensions-mini.webp";
import coinTele from "@/assets/stays/coin-tele.webp";
import coinTeleThumb from "@/assets/stays/coin-tele-mini.webp";
import chambre from "@/assets/stays/chambre.webp";
import chambreThumb from "@/assets/stays/chambre-mini.webp";

const AdminWorkspace = lazy(() => import("@/components/AdminWorkspace"));

const mainStay = { title: "Center Warm Stay", price: 500, weekendPrice: 700, guests: 2 };
const photos = [
  { src: studio, thumb: studioThumb, label: "Vue du studio" },
  { src: cuisine, thumb: cuisineThumb, label: "Cuisine" },
  { src: chambre, thumb: chambreThumb, label: "Coin nuit" },
  { src: salleEau, thumb: salleEauThumb, label: "Salle d’eau" },
  { src: coinSalon, thumb: coinSalonThumb, label: "Coin salon" },
  { src: evier, thumb: evierThumb, label: "Évier de cuisine" },
  { src: coinCafe, thumb: coinCafeThumb, label: "Coin café" },
  { src: cuisineSuspensions, thumb: cuisineSuspensionsThumb, label: "Vue d’ensemble de la cuisine" },
  { src: coinTele, thumb: coinTeleThumb, label: "Coin télé" },
];
const pages = [
  { file: "index.html", label: "Accueil" },
  { file: "logement.html", label: "Logement principal" },
  { file: "conciergerie.html", label: "Conciergerie" },
  { file: "blog.html", label: "Blog" },
  { file: "contact.html", label: "Contact" },
];

const homeArticles = [
  {
    slug: "location-journaliere-kenitra",
    image: "ruelle-bleue-chefchaouen-480.webp",
    title: "Location journalière à Kénitra, comment choisir son logement ?",
    summary: "Comparez le prix total, le quartier et les conditions d’arrivée avant de réserver.",
  },
  {
    slug: "studio-meuble-centre-ville-kenitra",
    image: "porte-bab-al-soufara-rabat-480.webp",
    title: "Studio meublé au centre-ville de Kénitra, que vérifier ?",
    summary: "Vérifiez le trajet depuis la gare, les équipements et les horaires d’arrivée.",
  },
  {
    slug: "week-end-kenitra-location-courte-duree",
    image: "artisanat-essaouira-maroc-480.webp",
    title: "Week-end à Kénitra, organiser une location courte durée",
    summary: "Préparez votre séjour en ville et une sortie vers la plage de Mehdia.",
  },
];

function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Kénitra, Maroc</p>
          <h1>Location courte durée à Kénitra, <em>comme chez soi.</em></h1>
          <p className="intro">Séjournez dans notre studio meublé au centre-ville de Kénitra, avec cuisine ouverte, lit double et coin salon. Vous pouvez envoyer votre demande de réservation directement sur le site.</p>
          <a className="stay-button" href="./logement.html">Découvrir le logement</a>
        </div>
        <figure className="hero-photo">
          <img src={studio} fetchPriority="high" decoding="async" alt="Vue du studio Center Warm Stay depuis la cuisine" />
          <img className="hero-detail photo-frame" src={coinCafeThumb} decoding="async" alt="" />
          <figcaption>Center Warm Stay, Kénitra</figcaption>
        </figure>
      </section>
      <section className="home-links" aria-label="Réservation et conciergerie">
        <div>
          <p className="eyebrow">Logement principal</p>
          <h2>Center Warm Stay</h2>
          <p>Studio avec cuisine ouverte, coin salon et espace nuit.</p>
          <a href="./logement.html#reservation">Réserver un séjour</a>
        </div>
        <div>
          <p className="eyebrow">Autres logements</p>
          <h2>Conciergerie à Kénitra</h2>
          <p>Découvrez nos logements et notre service pour les propriétaires à Kénitra et dans sa région.</p>
          <a href="./conciergerie.html#proprietaires">Confier mon logement</a>
          <a className="ml-4" href="./conciergerie.html">Voir les autres logements</a>
        </div>
      </section>
      <section className="editorial-section home-editorial" aria-labelledby="home-guides-title">
        <h2 id="home-guides-title">Nos guides pour séjourner à Kénitra</h2>
        <div className="editorial-grid">
          {homeArticles.map(({ slug, image, title, summary }) => (
            <article className="stay-card editorial-card" key={slug}>
              <a className="home-article-link" href={`./blog/${slug}.html`}>
                <img className="editorial-thumb" src={`./images/blog/${image}`} alt=""
                  width={480} height={300} loading="lazy" decoding="async" />
                <h3>{title}</h3>
              </a>
              <p>{summary}</p>
            </article>
          ))}
        </div>
        <a className="stay-button mt-5" href="./blog.html">Voir tous les articles</a>
      </section>
    </>
  );
}

function MainStay({ rentals }: { rentals: RentalProperty[] | null }) {
  const [selected, setSelected] = useState(0);
  const swipeStart = useRef<{ id: number; x: number; y: number } | null>(null);
  const rental = rentals?.find((property) => property.featured);
  const property = rental ? {
    id: rental.id, title: rental.title, price: Number(rental.nightly_price_mad),
    weekendPrice: rental.weekend_price_mad === null ? undefined : Number(rental.weekend_price_mad),
    guests: rental.max_guests,
  } : mainStay;
  const gallery = rental?.photos.length ? rental.photos.map((path, index) => {
    const src = rentalPhotoUrl(path);
    return { src, thumb: src, label: `Photo ${index + 1} du logement` };
  }) : photos;
  const currentIndex = selected < gallery.length ? selected : 0;
  const current = gallery[currentIndex];

  function movePhoto(direction: number) {
    setSelected((index) => ((index < gallery.length ? index : 0) + direction + gallery.length) % gallery.length);
  }

  return (
    <>
      <section className="page-intro">
        <p className="eyebrow">Logement principal · Kénitra</p>
        <h1>{property.title}</h1>
        <p className="intro">{rental?.description || "Un studio cosy avec une cuisine ouverte, un coin salon avec télévision, un lit double et une salle d’eau avec douche."}</p>
      </section>
      <div className="stay-detail">
        <div>
          <figure className="detail-photo photo-frame">
            <div className="detail-photo-stage" onKeyDown={(event) => {
              if (gallery.length < 2 || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
              event.preventDefault();
              movePhoto(event.key === "ArrowRight" ? 1 : -1);
            }} onPointerDown={(event) => {
              if (event.pointerType !== "touch" || !event.isPrimary || event.target !== event.currentTarget.firstElementChild) return;
              swipeStart.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
            }} onPointerUp={(event) => {
              const start = swipeStart.current;
              if (start?.id !== event.pointerId) return;
              swipeStart.current = null;
              const distance = event.clientX - start.x;
              if (gallery.length > 1 && Math.abs(distance) >= 45 && Math.abs(distance) > Math.abs(event.clientY - start.y)) {
                movePhoto(distance < 0 ? 1 : -1);
              }
            }} onPointerCancel={(event) => {
              if (swipeStart.current?.id === event.pointerId) swipeStart.current = null;
            }}>
              <img src={current.src} decoding="async" alt={current.label} draggable={false} />
              {gallery.length > 1 && (
                <>
                  <button className="gallery-arrow gallery-arrow-prev" type="button" aria-label="Photo précédente" onClick={() => movePhoto(-1)}>
                    <ChevronLeft aria-hidden="true" size={22} />
                  </button>
                  <button className="gallery-arrow gallery-arrow-next" type="button" aria-label="Photo suivante" onClick={() => movePhoto(1)}>
                    <ChevronRight aria-hidden="true" size={22} />
                  </button>
                </>
              )}
            </div>
            <figcaption aria-live="polite">
              <span>{current.label}</span>
              <span>{currentIndex + 1} / {gallery.length}</span>
            </figcaption>
          </figure>
          <div className="gallery-options" role="group" aria-label="Galerie de photos">
            {gallery.map((photo, index) => (
              <button className="photo-frame" key={photo.label} type="button" aria-label={`Afficher ${photo.label.toLocaleLowerCase("fr")}`}
                aria-pressed={index === currentIndex} onClick={() => setSelected(index)}>
                <img loading="lazy" decoding="async" width={396} height={264} src={photo.thumb} alt="" />
              </button>
            ))}
          </div>
        </div>
        <section id="reservation" className="booking-panel" aria-labelledby="booking-title">
          <p className="eyebrow">Réservation</p>
          <h2 id="booking-title">Préparer mon séjour</h2>
          {rental ? <BookingForm property={property} /> : <p>{supabase && rentals === null ? "Chargement…" : "Les réservations en ligne pour ce logement sont momentanément indisponibles."}</p>}
        </section>
      </div>
    </>
  );
}

function Concierge({ rentals }: { rentals: RentalProperty[] | null }) {
  return (
    <>
      <section className="page-intro">
        <p className="eyebrow">Conciergerie · Kénitra et alentours</p>
        <h1>Autres logements</h1>
        <p className="intro">Découvrez les logements proposés à Kénitra et dans sa région, ou parlez-nous du bien que vous souhaitez mettre en location courte durée.</p>
        <a className="stay-button mt-5" href="#proprietaires">Confier mon logement</a>
      </section>
      <PropertiesSection rentals={rentals} />
      <ConciergeInquiry />
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [rentals, setRentals] = useState<RentalProperty[] | null>(null);
  const filename = window.location.pathname.split("/").pop();
  const rulesPage = filename === "reglement.html";
  const dashboardPage = filename === "gestion.html";
  const page = pages.find(({ file }) => file === filename) ?? (rulesPage || dashboardPage ? undefined : pages[0]);

  useEffect(() => {
    if (!supabase || (filename !== "logement.html" && filename !== "conciergerie.html")) return;
    let active = true;
    void getPublishedProperties().then(
      (rows) => { if (active) setRentals(rows); },
      () => { if (active) setRentals([]); },
    );
    return () => { active = false; };
  }, [filename]);

  return (
    <TooltipProvider>
      <header className="stay-header" onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          setMenuOpen(false);
          menuButton.current?.focus();
        }
      }}>
        <div className="stay-shell header-inner">
          <BrandLink />
          <button
            className="stay-menu-toggle"
            type="button"
            ref={menuButton}
            aria-controls="stay-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <nav id="stay-navigation" data-open={menuOpen} aria-label="Navigation principale">
            {pages.map(({ file, label }) => (
              <a key={file} href={`./${file}`} onClick={() => setMenuOpen(false)} aria-current={file === page?.file ? "page" : undefined}>{label}</a>
            ))}
          </nav>
        </div>
      </header>
      <main className="stay-shell">
        {dashboardPage ? <Suspense fallback={<p>Chargement du tableau de bord…</p>}><AdminWorkspace /></Suspense> : rulesPage ? <HouseRules /> : page?.file === "logement.html" ? <MainStay rentals={rentals} /> : page?.file === "conciergerie.html" ? <Concierge rentals={rentals} /> : page?.file === "contact.html" ? <Contact /> : <Home />}
      </main>
    </TooltipProvider>
  );
}
