import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token a cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Token agregado a la petición:", config.url);
    } else {
      console.log("⚠️ No hay token disponible para:", config.url);
    }
    return config;
  },
  (error) => {
    console.error("❌ Error en request interceptor:", error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar refresh token
api.interceptors.response.use(
  (response) => {
    console.log("✅ Respuesta exitosa de:", response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.log("🔴 Error en petición:", {
      url: originalRequest.url,
      status: error.response?.status,
      hasToken: !!localStorage.getItem("access_token"),
    });

    // Si es 401 y no es el endpoint de login/token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/token/")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          console.log("❌ No hay refresh token disponible");
          throw new Error("No refresh token");
        }

        console.log("🔄 Intentando renovar token...");

        // Usar axios directo para evitar interceptores
        const response = await axios.post(
          `${API_BASE_URL}/api/token/refresh/`,
          { refresh: refreshToken }
        );

        const { access } = response.data;
        localStorage.setItem("access_token", access);
        console.log("✅ Token renovado exitosamente");

        // Actualizar el header de la petición original
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (err) {
        console.error("❌ Error al renovar token:", err);
        // Si falla el refresh, limpiar y redirigir
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
