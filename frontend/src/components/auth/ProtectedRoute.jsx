import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingScreen from "../common/LoadingScreen";

export default function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();

  if (initializing) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
