import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phone = "212600000000";
  const message = encodeURIComponent("Bonjour, je souhaite en savoir plus sur vos services de conciergerie à Kénitra.");
  
  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
      aria-label="Contacter via WhatsApp"
    >
      <MessageCircle size={26} />
    </a>
  );
};

export default WhatsAppButton;
