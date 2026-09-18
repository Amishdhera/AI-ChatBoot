import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingScreen from "../common/LoadingScreen";

export default function PublicOnlyRoute({ children }) {
  const { user, initializing } = useAuth();

  if (initializing) return <LoadingScreen />;
  if (user) return <Navigate to="/chat" replace />;

  return children;
}
