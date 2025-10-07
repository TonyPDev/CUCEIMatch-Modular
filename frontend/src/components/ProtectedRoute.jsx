import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return <div>Cargando...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
