import { Navigate } from "react-router-dom";
import { useAuth, isAdminUser } from "../../lib/auth";

export const AdminRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="section-padding">Loading...</div>;
  }
  if (!user || !isAdminUser(user)) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};
