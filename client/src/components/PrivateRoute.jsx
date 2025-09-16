import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function PrivateRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.isDeleted && location.pathname !== "/dashboard/profile") {
    return <Navigate to="/dashboard/profile" replace />;
  }

  return <Outlet />;
};
