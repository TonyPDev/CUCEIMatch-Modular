import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setAuth: (user, tokens) => {
        // Guardar tokens
        localStorage.setItem("access_token", tokens.access);
        localStorage.setItem("refresh_token", tokens.refresh);

        // Actualizar estado
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        // Limpiar tokens
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        // Limpiar estado
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),

      // Función para verificar si hay sesión activa
      checkAuth: () => {
        const token = localStorage.getItem("access_token");
        const user = localStorage.getItem("auth-storage");

        if (token && user) {
          return true;
        }
        return false;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
