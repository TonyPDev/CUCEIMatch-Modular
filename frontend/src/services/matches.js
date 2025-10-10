import api from "./api";

export const matchesService = {
  // Obtener candidatos para swipe
  getCandidatos: async () => {
    const response = await api.get("/api/matches/candidatos/");
    return response.data;
  },

  // Hacer swipe (like/dislike/superlike)
  hacerSwipe: async (usuario_destino, tipo) => {
    const response = await api.post("/api/matches/swipe/", {
      usuario_destino,
      tipo,
    });
    return response.data;
  },

  // Obtener mis matches
  getMisMatches: async () => {
    const response = await api.get("/api/matches/");
    return response.data;
  },

  // Obtener detalles de un match
  getMatchDetalle: async (matchId) => {
    const response = await api.get(`/api/matches/${matchId}/`);
    return response.data;
  },

  // Eliminar un match
  eliminarMatch: async (matchId) => {
    const response = await api.delete(`/api/matches/${matchId}/eliminar/`);
    return response.data;
  },
};
