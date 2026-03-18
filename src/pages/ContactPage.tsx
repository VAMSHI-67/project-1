import { Mail, MapPinned, MessageCircle, Phone } from "lucide-react";
import { siteConfig, whatsappBookingLink } from "../data/site";

export const ContactPage = () => {
  return (
    <div className="section-padding">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-forest-500">Contact</p>
        <h1 className="mt-3 font-display text-4xl text-forest-900">Reach Kanvera Farms</h1>
        <p className="mt-3 max-w-2xl text-forest-600">
          Planning a family outing, group retreat, or celebration? Contact us directly and reserve the whole property.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="glass-card space-y-5 rounded-3xl p-6">
          <div className="rounded-2xl bg-forest-50 p-4">
            <p className="text-sm uppercase tracking-[0.2em] text-forest-500">Primary Booking Channel</p>
            <a
              href={whatsappBookingLink}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest-700 via-forest-600 to-forest-500 px-5 py-3 text-sm font-semibold text-white shadow-glow"
            >
              <MessageCircle className="h-4 w-4" /> Book on WhatsApp
            </a>
          </div>

          <div className="space-y-3 text-sm text-forest-700">
            <p className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4 text-forest-600" /> {siteConfig.contact.phoneDisplay}
            </p>
            <p className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-forest-600" /> kanverafarms@gmail.com
            </p>
            <p className="inline-flex items-start gap-2">
              <MapPinned className="mt-0.5 h-4 w-4 flex-shrink-0 text-forest-600" /> {siteConfig.contact.address}
            </p>
            <p className="text-xs text-forest-500">Plus code: {siteConfig.contact.plusCode}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-forest-100 bg-white">
          <iframe
            title="Kanvera Farms map"
            src="https://www.google.com/maps?q=17.7624642,78.6581144&z=15&output=embed"
            className="h-[420px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};
