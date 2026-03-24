import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../shared/Button";
import { useAuth } from "../../lib/auth";

const adminLinks = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Bookings", to: "/admin/bookings" },
  { label: "Calendar", to: "/admin/calendar" },
  { label: "Media", to: "/admin/walkthrough" }
];

export const AdminHeader = ({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-forest-500">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl text-forest-900">{title}</h1>
          {description && <p className="mt-3 max-w-2xl text-sm text-forest-600">{description}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          {action}
          <Button type="button" variant="outline" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {adminLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              location.pathname === link.to
                ? "bg-forest-700 text-white"
                : "border border-forest-200 bg-white text-forest-700 hover:bg-forest-50"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
