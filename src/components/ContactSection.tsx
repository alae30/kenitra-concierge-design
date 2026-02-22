import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin } from "lucide-react";

const ContactSection = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé !",
      description: "Nous vous recontacterons dans les plus brefs délais.",
    });
    setForm({ name: "", email: "", phone: "", type: "", message: "" });
  };

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary uppercase tracking-[0.3em] text-sm mb-4">Parlons de votre projet</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">Contactez-Nous</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
              Prêt à maximiser vos revenus ?
            </h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Remplissez le formulaire ci-contre ou contactez-nous directement.
              Notre équipe vous répondra sous 24h.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-foreground font-medium">Téléphone</p>
                  <p className="text-muted-foreground text-sm">+212 6 00 00 00 00</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-foreground font-medium">Email</p>
                  <p className="text-muted-foreground text-sm">contact@conciergerie-kenitra.ma</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-foreground font-medium">Adresse</p>
                  <p className="text-muted-foreground text-sm">Kénitra, Maroc</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-card border border-border p-8 space-y-5"
          >
            <Input
              placeholder="Votre nom complet"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="bg-background border-border"
            />
            <Input
              type="email"
              placeholder="Votre email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="bg-background border-border"
            />
            <Input
              placeholder="Votre téléphone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="bg-background border-border"
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">Type de bien</option>
              <option value="appartement">Appartement</option>
              <option value="villa">Villa</option>
              <option value="studio">Studio</option>
              <option value="riad">Riad</option>
              <option value="autre">Autre</option>
            </select>
            <Textarea
              placeholder="Votre message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              className="bg-background border-border"
            />
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 text-sm font-bold uppercase tracking-wider hover:bg-gold-light transition-all duration-300"
            >
              Envoyer ma demande
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
