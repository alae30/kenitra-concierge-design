import { motion } from "framer-motion";
import { Clock, TrendingUp, Shield } from "lucide-react";

const engagements = [
  {
    icon: Clock,
    title: "Flexibilité",
    description: "Adaptez la gestion à vos besoins. Aucun engagement de durée, vous restez maître de votre bien.",
  },
  {
    icon: TrendingUp,
    title: "Rentabilité",
    description: "Optimisez vos revenus grâce à notre tarification dynamique et notre expertise du marché local.",
  },
  {
    icon: Shield,
    title: "Zéro Stress",
    description: "Nous gérons tout de A à Z : annonces, voyageurs, ménage, maintenance et support 24/7.",
  },
];

const EngagementsSection = () => {
  return (
    <section id="engagements" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary uppercase tracking-[0.3em] text-sm mb-4">Nos Promesses</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">
            Nos Engagements
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {engagements.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="bg-card border border-border p-8 text-center group hover:border-primary/50 transition-all duration-500"
            >
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-primary/30 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                <item.icon size={28} />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EngagementsSection;
