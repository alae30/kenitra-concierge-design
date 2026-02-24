import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EngagementsSection from "@/components/EngagementsSection";
import PresentationSection from "@/components/PresentationSection";
import ServicesSection from "@/components/ServicesSection";
import PropertiesSection from "@/components/PropertiesSection";
import PricingSection from "@/components/PricingSection";
import WhyUsSection from "@/components/WhyUsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <EngagementsSection />
      <PresentationSection />
      <ServicesSection />
      <PropertiesSection />
      <PricingSection />
      <WhyUsSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default Index;
