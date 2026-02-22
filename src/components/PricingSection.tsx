import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Gestion Partielle",
    rate: "10%",
    desc: "Pour les propriétaires qui souhaitent garder le contrôle tout en bénéficiant d'un soutien professionnel.",
    features: [
      "Création et optimisation d'annonce",
      "Tarification dynamique",
      "Gestion des réservations",
      "Support par email",
      "Reporting mensuel",
    ],
    recommended: false,
  },
  {
    name: "Gestion Intégrale",
    rate: "20%",
    desc: "La solution clé en main. Nous gérons absolument tout pour vous, vous n'avez rien à faire.",
    features: [
      "Tout ce qui est inclus dans Gestion Partielle",
      "Check-in / Check-out personnalisé",
      "Ménage professionnel",
      "Maintenance & interventions",
      "Kit d'accueil premium",
      "Support 24/7",
      "Optimisation des avis",
      "Reporting en temps réel",
    ],
    recommended: true,
  },
];

const PricingSection = () => {
  return (
    <section id="tarifs" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary uppercase tracking-[0.3em] text-sm mb-4">Nos Formules</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">Nos Tarifs</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className={`relative bg-card border p-8 md:p-10 ${
                plan.recommended ? "border-primary" : "border-border"
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-1 text-xs font-bold uppercase tracking-wider">
                  Recommandé
                </div>
              )}
              <h3 className="font-serif text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="font-serif text-5xl font-bold text-primary">{plan.rate}</span>
                <span className="text-muted-foreground text-sm">des revenus locatifs</span>
              </div>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">{plan.desc}</p>
              <div className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <Check className="text-primary mt-0.5 shrink-0" size={16} />
                    <span className="text-foreground/80 text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <a
                href="#contact"
                className={`block text-center py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  plan.recommended
                    ? "bg-primary text-primary-foreground hover:bg-gold-light"
                    : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                Choisir cette formule
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
