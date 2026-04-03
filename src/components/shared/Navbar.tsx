import logoImage from "../../assets/branding/kanvera-logo-green.png";
import { Link, NavLink } from "react-router-dom";
import { MessageCircle, Menu } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { siteConfig, whatsappBookingLink } from "../../data/site";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Booking", to: "/booking" },
  { label: "Contact", to: "/contact" }
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-forest-100 bg-forest-50/85 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3 text-forest-800">
          <img
            src={logoImage}
            alt="Kanvera Resort and Convention logo"
            className="h-12 w-auto object-contain md:h-14"
          />
          <div className="hidden sm:block">
            <p className="font-display text-lg leading-tight">{siteConfig.brand.name}</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-forest-500">{siteConfig.brand.localName}</p>
          </div>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? "text-forest-700" : "text-forest-500 hover:text-forest-700"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <a
            href={whatsappBookingLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest-700 via-forest-600 to-forest-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]"
          >
            <MessageCircle className="h-4 w-4" /> Book on WhatsApp
          </a>
        </div>
        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>
      {open && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="md:hidden">
          <div className="flex flex-col gap-3 px-6 pb-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? "text-forest-700" : "text-forest-500"}`
                }
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href={whatsappBookingLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-forest-700 via-forest-600 to-forest-500 px-5 py-3 text-center text-sm font-semibold text-white shadow-glow"
            >
              <MessageCircle className="h-4 w-4" /> Book on WhatsApp
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
};
