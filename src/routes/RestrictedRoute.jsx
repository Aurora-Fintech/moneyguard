import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
export default function RestrictedRoute({ children }) {
  const isLoggedIn = useSelector((s) => s.auth.isLoggedIn);
  return !isLoggedIn ? children : <Navigate to="/dashboard" replace />;
}
