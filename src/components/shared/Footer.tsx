import { Leaf, Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => (
  <footer className="bg-forest-900 text-forest-50">
    <div className="section-padding grid gap-10 md:grid-cols-3">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-gold-300" />
          <span className="font-display text-lg">GreenNest Farm Stay</span>
        </div>
        <p className="text-sm text-forest-100">
          A premium nature retreat with handcrafted rooms, farm-to-table dining, and curated experiences.
        </p>
      </div>
      <div className="space-y-3 text-sm">
        <h3 className="font-semibold text-forest-50">Contact</h3>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gold-300" />
          <span>Willow Creek Valley, Oregon</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gold-300" />
          <span>+1 (503) 555-0198</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gold-300" />
          <span>hello@greennestfarmstay.com</span>
        </div>
      </div>
      <div className="space-y-3 text-sm">
        <h3 className="font-semibold text-forest-50">Stay Inspired</h3>
        <p className="text-forest-100">
          Follow seasonal updates, exclusive offers, and behind-the-scenes stories from the farm.
        </p>
      </div>
    </div>
    <div className="border-t border-forest-700/60 py-4 text-center text-xs text-forest-200">
      © 2024 GreenNest Farm Stay. All rights reserved.
    </div>
  </footer>
);
