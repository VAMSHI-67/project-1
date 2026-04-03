import logoImage from "../../assets/branding/kanvera-logo-green.png";
import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { siteConfig, whatsappBookingLink } from "../../data/site";

export const Footer = () => (
  <footer className="bg-forest-900 text-forest-50">
    <div className="section-padding grid gap-10 md:grid-cols-3">
      <div className="space-y-4">
        <div className="inline-flex w-fit rounded-3xl bg-white/95 p-3 shadow-glow">
          <img
            src={logoImage}
            alt="Kanvera Resort and Convention logo"
            className="h-auto w-[220px] object-contain md:w-[240px]"
          />
        </div>
        <p className="text-sm text-forest-100">
          A destination for nature stays, private celebrations, family gatherings, and convention experiences across one
          beautiful Kanvera property.
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
          <span>{siteConfig.contact.email}</span>
        </div>
        <a
          href={siteConfig.contact.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-forest-100 hover:text-white"
        >
          <Instagram className="h-4 w-4 text-gold-300" /> {siteConfig.contact.instagramHandle}
        </a>
      </div>
      <div className="space-y-3 text-sm">
        <h3 className="font-semibold text-forest-50">Quick Actions</h3>
        <a
          href={siteConfig.contact.mapLink}
          target="_blank"
          rel="noreferrer"
          className="block text-forest-100 hover:text-white"
        >
          Open in Google Maps
        </a>
        <a
          href={whatsappBookingLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-forest-50 hover:bg-white/20"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp Booking
        </a>
        <a
          href={siteConfig.contact.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-forest-50 hover:bg-white/20"
        >
          <Instagram className="h-4 w-4" /> Instagram
        </a>
        <p className="text-forest-200">Google rating snapshot: 4.4 stars (263 reviews)</p>
      </div>
    </div>
    <div className="border-t border-forest-700/60 py-4 text-center text-xs text-forest-200">
      Copyright 2026 {siteConfig.brand.name}. All rights reserved.
    </div>
  </footer>
);

