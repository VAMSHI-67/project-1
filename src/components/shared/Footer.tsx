import { Leaf, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { siteConfig, whatsappBookingLink } from "../../data/site";

export const Footer = () => (
  <footer className="bg-forest-900 text-forest-50">
    <div className="section-padding grid gap-10 md:grid-cols-3">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-gold-300" />
          <div>
            <p className="font-display text-lg">{siteConfig.brand.name}</p>
            <p className="text-xs text-forest-200">{siteConfig.brand.localName}</p>
          </div>
        </div>
        <p className="text-sm text-forest-100">
          Nature-filled full-property farmstay getaways for families, friends, and celebrations.
        </p>
      </div>
      <div className="space-y-3 text-sm">
        <h3 className="font-semibold text-forest-50">Contact</h3>
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-300" />
          <span>{siteConfig.contact.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gold-300" />
          <a href={`tel:${siteConfig.contact.phoneRaw}`}>{siteConfig.contact.phoneDisplay}</a>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gold-300" />
          <span>kanverafarms@gmail.com</span>
        </div>
      </div>
      <div className="space-y-3 text-sm">
        <h3 className="font-semibold text-forest-50">Quick Actions</h3>
        <a href={siteConfig.contact.mapLink} target="_blank" rel="noreferrer" className="block text-forest-100 hover:text-white">
          Open in Google Maps
        </a>
        <a href={whatsappBookingLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-forest-50 hover:bg-white/20">
          <MessageCircle className="h-4 w-4" /> WhatsApp Booking
        </a>
        <p className="text-forest-200">Google rating snapshot: 4.4 ★ (263 reviews)</p>
      </div>
    </div>
    <div className="border-t border-forest-700/60 py-4 text-center text-xs text-forest-200">
      © 2026 {siteConfig.brand.name}. All rights reserved.
    </div>
  </footer>
);
