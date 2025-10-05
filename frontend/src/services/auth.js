import api from "./api";

export const authService = {
  // Validar QR de credencial
  validarQR: async (url_qr) => {
    const response = await api.post("/usuarios/validar-qr/", { url_qr });
    return response.data;
  },

  // Registro completo
  registro: async (data) => {
    const response = await api.post("/usuarios/registro/", data);
    return response.data;
  },

  // Login
  login: async (email, password) => {
    const response = await api.post("/token/", { email, password });
    return response.data;
  },

  // Obtener perfil del usuario autenticado
  getPerfil: async () => {
    const response = await api.get("/usuarios/perfil/");
    return response.data;
  },

  // Actualizar datos del usuario
  actualizarUsuario: async (data) => {
    const response = await api.patch("/usuarios/actualizar/", data);
    return response.data;
  },
};
