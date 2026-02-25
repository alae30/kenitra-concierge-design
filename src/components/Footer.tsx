import AnimatedLogo from "./AnimatedLogo";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <AnimatedLogo size="sm" />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Votre partenaire de confiance pour la gestion locative premium à Kénitra.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <div className="space-y-2">
              {["Accueil", "Engagements", "Services", "Tarifs", "Contact"].map((l) => (
                <a
                  key={l}
                  href={`#${l === "Accueil" ? "hero" : l.toLowerCase()}`}
                  className="block text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Contact
            </h4>
            <div className="space-y-2 text-muted-foreground text-sm">
              <p>+212 6 00 00 00 00</p>
              <p>contact@conciergerie-kenitra.ma</p>
              <p>Kénitra, Maroc</p>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Conciergerie Kénitra. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
