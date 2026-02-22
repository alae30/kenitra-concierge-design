import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const features = [
  "Gestion complète de vos annonces Airbnb & Booking",
  "Communication professionnelle avec les voyageurs",
  "Ménage et préparation du logement entre chaque séjour",
  "Suivi en temps réel de vos réservations et revenus",
];

const PresentationSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary uppercase tracking-[0.3em] text-sm mb-4">Notre Mission</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              Louez votre résidence en toute <span className="text-primary">confiance</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Notre conciergerie prend en charge l'intégralité de la gestion locative de votre bien à Kénitra.
              De la création de l'annonce à l'accueil des voyageurs, en passant par le ménage et la maintenance,
              nous vous offrons une prestation premium pour valoriser votre propriété.
            </p>
            <div className="space-y-4">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="text-primary mt-0.5 shrink-0" size={20} />
                  <span className="text-foreground/80 text-sm">{f}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-card border border-border p-10">
              <div className="space-y-6">
                <div className="border-l-2 border-primary pl-6">
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    Une prestation premium
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Nous traitons chaque propriété comme un hôtel de luxe. Chaque détail compte
                    pour offrir une expérience exceptionnelle à vos voyageurs et maximiser vos avis positifs.
                  </p>
                </div>
                <div className="border-l-2 border-primary pl-6">
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    Transparence totale
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Accédez à un tableau de bord en temps réel pour suivre vos réservations,
                    revenus et dépenses. Aucun frais caché, une communication claire et régulière.
                  </p>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -top-4 -right-4 w-full h-full border border-primary/20 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PresentationSection;
