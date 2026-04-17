import { MessageCircle } from "lucide-react";
import { getWhatsAppHref, openWhatsAppConversation } from "../../lib/whatsapp";

export const QuickBookingWidget = () => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    openWhatsAppConversation();
  };

  return (
    <a
      href={getWhatsAppHref()}
      target="_blank"
      rel="noreferrer"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest-700 via-forest-600 to-forest-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]"
    >
      <MessageCircle className="h-4 w-4" /> Book a Kanvera Venue
    </a>
  );
};
