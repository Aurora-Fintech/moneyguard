import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  selectIsLoggedIn,
  selectIsRefreshing,
} from "../features/auth/authSelectors";

export default function PrivateRoute({ children }) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);

  if (isRefreshing) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
}
