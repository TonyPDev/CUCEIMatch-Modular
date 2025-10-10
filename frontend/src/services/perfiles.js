import api from "./api";

export const perfilesService = {
  // Subir una foto de perfil
  subirFoto: async (foto) => {
    const formData = new FormData();
    formData.append("imagen", foto);

    const response = await api.post("/api/perfiles/fotos/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
