import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../stores/authStore";

export const useAuth = () => {
  const { isAuthenticated: isAuthFromStore, user } = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState(isAuthFromStore);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        // Comprueba si el token ha expirado
        if (decodedToken.exp * 1000 < Date.now()) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [isAuthFromStore]);

  return { isAuthenticated, user };
};
