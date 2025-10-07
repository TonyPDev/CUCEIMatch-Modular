import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../stores/authStore";

export const useAuth = () => {
  const { isAuthenticated: isAuthFromStore, user, logout } = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(accessToken);

        // Comprueba si el token ha expirado
        if (decodedToken.exp * 1000 < Date.now()) {
          console.log("Token expirado");
          logout();
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error decodificando token:", error);
        logout();
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [isAuthFromStore, logout]);

  return { isAuthenticated, user };
};
