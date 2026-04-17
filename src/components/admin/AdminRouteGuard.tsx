import { Navigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";

export const AdminRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) {
    return <div className="section-padding">Loading...</div>;
  }
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};
