import { Link, NavLink } from "react-router-dom";
import { Leaf, Menu } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Rooms", to: "/rooms" },
  { label: "Booking", to: "/booking" },
  { label: "Contact", to: "/contact" }
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-forest-50/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-forest-800">
          <Leaf className="h-6 w-6 text-forest-600" />
          <span className="font-display text-lg">GreenNest Farm Stay</span>
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
          <Link
            to="/booking"
            className="rounded-full bg-gradient-to-r from-forest-700 via-forest-600 to-forest-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]"
          >
            Book Your Stay
          </Link>
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
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden"
        >
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
            <Link
              to="/booking"
              onClick={() => setOpen(false)}
              className="rounded-full bg-gradient-to-r from-forest-700 via-forest-600 to-forest-500 px-5 py-3 text-center text-sm font-semibold text-white shadow-glow"
            >
              Book Your Stay
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
};
