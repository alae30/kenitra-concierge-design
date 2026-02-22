import { motion } from "framer-motion";

const services = [
  { num: "01", title: "Création d'Annonce", desc: "Photos professionnelles, rédaction optimisée et mise en ligne sur les plateformes." },
  { num: "02", title: "Tarification Dynamique", desc: "Ajustement automatique des prix selon la demande et la saisonnalité." },
  { num: "03", title: "Gestion des Réservations", desc: "Coordination complète des calendriers et communication avec les voyageurs." },
  { num: "04", title: "Check-in / Check-out", desc: "Accueil personnalisé et remise des clés, vérification du logement au départ." },
  { num: "05", title: "Ménage Professionnel", desc: "Nettoyage complet et préparation du logement entre chaque séjour." },
  { num: "06", title: "Maintenance", desc: "Intervention rapide pour tout problème technique ou de confort." },
  { num: "07", title: "Kit d'Accueil", desc: "Produits de bienvenue premium pour une première impression mémorable." },
  { num: "08", title: "Support 24/7", desc: "Assistance permanente pour vos voyageurs, jour et nuit." },
  { num: "09", title: "Reporting Financier", desc: "Suivi détaillé de vos revenus et dépenses en temps réel." },
  { num: "10", title: "Optimisation des Avis", desc: "Stratégie proactive pour maximiser vos évaluations positives." },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary uppercase tracking-[0.3em] text-sm mb-4">Ce que nous offrons</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">Nos Services</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
          {services.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-card border border-border p-6 group hover:border-primary/50 transition-all duration-500"
            >
              <span className="font-serif text-3xl font-bold text-primary/30 group-hover:text-primary transition-colors">
                {s.num}
              </span>
              <h3 className="font-serif text-base font-semibold text-foreground mt-3 mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
