import { Heart, X, Star, MapPin, GraduationCap, Calendar } from "lucide-react";
import { useState } from "react";

export default function SwipeCard({ usuario, onSwipe }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const fotos = usuario.fotos || [];
  const fotoActual = fotos[currentPhotoIndex];

  const nextPhoto = () => {
    if (currentPhotoIndex < fotos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const edad = calcularEdad(usuario.fecha_nacimiento);

  return (
    <div className="relative w-full h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Imagen con navegación */}
      <div className="relative w-full h-[400px] bg-gray-200">
        {fotoActual ? (
          <img
            src={fotoActual.imagen_url}
            alt={usuario.nombre_completo}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <GraduationCap size={64} className="text-gray-400" />
          </div>
        )}

        {/* Indicadores de fotos */}
        {fotos.length > 1 && (
          <div className="absolute top-4 left-0 right-0 flex gap-2 px-4">
            {fotos.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full transition-all ${
                  index === currentPhotoIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Áreas de navegación de fotos */}
        {fotos.length > 1 && (
          <>
            <div
              className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer"
              onClick={prevPhoto}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer"
              onClick={nextPhoto}
            />
          </>
        )}

        {/* Gradiente inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Información del usuario */}
      <div className="p-6 space-y-4">
        {/* Nombre y edad */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {usuario.nombre_completo}
            {edad && <span className="text-2xl text-gray-600">, {edad}</span>}
          </h2>
        </div>

        {/* Detalles */}
        <div className="space-y-2">
          {usuario.carrera && (
            <div className="flex items-center gap-2 text-gray-600">
              <GraduationCap size={20} />
              <span>
                {usuario.carrera}
                {usuario.semestre && ` • ${usuario.semestre}° semestre`}
              </span>
            </div>
          )}

          {usuario.perfil?.bio && (
            <p className="text-gray-700 mt-4">{usuario.perfil.bio}</p>
          )}

          {usuario.perfil?.intereses && usuario.perfil.intereses.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {usuario.perfil.intereses.map((interes, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                >
                  {interes}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-6">
        <button
          onClick={() => onSwipe("dislike")}
          className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <X size={32} className="text-red-500" />
        </button>

        <button
          onClick={() => onSwipe("superlike")}
          className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Star size={32} className="text-blue-500" />
        </button>

        <button
          onClick={() => onSwipe("like")}
          className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart size={32} className="text-pink-500" />
        </button>
      </div>
    </div>
  );
}
