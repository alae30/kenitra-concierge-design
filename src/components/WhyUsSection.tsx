import { motion } from "framer-motion";
import { MapPin, Clock, Eye, HeadphonesIcon } from "lucide-react";

const reasons = [
  { icon: Clock, title: "Manque de temps ?", desc: "Nous gérons tout au quotidien pour que vous puissiez vous concentrer sur l'essentiel." },
  { icon: MapPin, title: "Pas sur place ?", desc: "Notre équipe locale est présente à Kénitra pour gérer votre bien comme si c'était le nôtre." },
  { icon: Eye, title: "Suivi en temps réel", desc: "Tableau de bord transparent avec toutes vos données : réservations, revenus, dépenses." },
  { icon: HeadphonesIcon, title: "Support dédié", desc: "Un interlocuteur unique vous accompagne et répond à toutes vos questions." },
];

const WhyUsSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary uppercase tracking-[0.3em] text-sm mb-4">Vos Avantages</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">
            Pourquoi Nous Choisir
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6"
            >
              <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center bg-primary/10 text-primary">
                <r.icon size={24} />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{r.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
