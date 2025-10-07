import api from "./api";

export const authService = {
  // Validar QR de credencial
  validarQR: async (url_qr) => {
    const response = await api.post("/api/usuarios/validar-qr/", { url_qr });
    return response.data;
  },

  // Registro completo
  registro: async (data) => {
    const response = await api.post("/api/usuarios/registro/", data);
    return response.data;
  },

  // Login
  login: async (email, password) => {
    console.log("🔐 Intentando login...");
    const response = await api.post("/api/token/", { email, password });
    console.log("✅ Login exitoso, tokens recibidos");

    // Guardar tokens inmediatamente
    if (response.data.access) {
      localStorage.setItem("access_token", response.data.access);
      console.log("💾 Access token guardado");
    }
    if (response.data.refresh) {
      localStorage.setItem("refresh_token", response.data.refresh);
      console.log("💾 Refresh token guardado");
    }

    return response.data;
  },

  // Obtener perfil del usuario autenticado
  getPerfil: async () => {
    console.log("👤 Obteniendo perfil del usuario...");
    const token = localStorage.getItem("access_token");
    console.log("Token disponible:", token ? "Sí ✅" : "No ❌");

    const response = await api.get("/api/usuarios/perfil/");
    console.log("✅ Perfil obtenido:", response.data);
    return response.data;
  },

  // Actualizar datos del usuario
  actualizarUsuario: async (data) => {
    const response = await api.patch("/api/usuarios/actualizar/", data);
    return response.data;
  },
};
