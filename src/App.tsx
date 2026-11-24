import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BookingForm } from "@/components/BookingDialog";
import PropertiesSection from "@/components/PropertiesSection";
import salon from "@/assets/stays/salon.jpg";
import cuisine from "@/assets/stays/cuisine.jpg";
import chambre from "@/assets/stays/chambre.jpg";

const mainStay = { title: "Center Warm Stay", price: 500, weekendPrice: 700, guests: 2 };
const photos = [
  { src: salon, label: "Espace de vie" },
  { src: cuisine, label: "Cuisine" },
  { src: chambre, label: "Coin nuit" },
];
const pages = [
  { file: "index.html", label: "Accueil" },
  { file: "logement.html", label: "Logement principal" },
  { file: "conciergerie.html", label: "Conciergerie" },
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
          <img src={salon} alt="Salon aux tons naturels, photo d’illustration" />
          <figcaption>Photo d’illustration</figcaption>
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
            <img src={photos[selected].src} alt={`${photos[selected].label}, photo d’illustration`} />
            <figcaption>{photos[selected].label} · Photo d’illustration</figcaption>
          </figure>
          <div className="gallery-options" role="group" aria-label="Galerie de photos">
            {photos.map((photo, index) => (
              <button key={photo.label} type="button" aria-label={`Afficher ${photo.label.toLocaleLowerCase("fr")}`}
                aria-pressed={index === selected} onClick={() => setSelected(index)}>
                <img src={photo.src} alt="" />
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

export default function App() {
  const filename = window.location.pathname.split("/").pop();
  const page = pages.find(({ file }) => file === filename) ?? pages[0];

  return (
    <TooltipProvider>
      <header className="stay-header">
        <div className="stay-shell header-inner">
          <a className="stay-brand" href="./index.html">Center Warm Stay <small>Kénitra · Maroc</small></a>
          <nav aria-label="Navigation principale">
            {pages.map(({ file, label }) => (
              <a key={file} href={`./${file}`} aria-current={file === page.file ? "page" : undefined}>{label}</a>
            ))}
          </nav>
        </div>
      </header>
      <main className="stay-shell">
        {page.file === "logement.html" ? <MainStay /> : page.file === "conciergerie.html" ? <Concierge /> : <Home />}
      </main>
      <footer className="stay-footer">
        <div className="stay-shell"><span>Center Warm Stay</span><span>Kénitra, Maroc</span></div>
      </footer>
    </TooltipProvider>
  );
}
