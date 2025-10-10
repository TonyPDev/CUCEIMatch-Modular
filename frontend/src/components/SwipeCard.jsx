import { ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function SwipeCard({ usuario }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const fotos = usuario.fotos || [];
  const fotoActual = fotos[currentPhotoIndex];
  const intervalRef = useRef(null);

  // Efecto para el cambio automático de fotos
  useEffect(() => {
    // Solo activar si hay más de una foto
    if (fotos.length > 1) {
      // Limpiar intervalo anterior al cambiar de usuario
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Iniciar nuevo intervalo
      intervalRef.current = setInterval(() => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % fotos.length);
      }, 3000); // Cambia cada 3 segundos
    }

    // Limpiar el intervalo cuando el componente se desmonte
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fotos.length, usuario]); // Se ejecuta cuando cambia el usuario

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % fotos.length);
    }, 3000);
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % fotos.length);
    resetInterval(); // Reinicia el temporizador
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex(
      (prevIndex) => (prevIndex - 1 + fotos.length) % fotos.length
    );
    resetInterval(); // Reinicia el temporizador
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
    <div className="relative w-full h-[545px] bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Imagen con navegación */}
      <div className="relative w-full h-full bg-gray-200">
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

        {/* Botones de navegación de fotos */}
        {fotos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Gradiente inferior e información */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
          <h2 className="text-3xl font-bold">
            {usuario.nombre_completo}
            {edad && <span className="font-light">, {edad}</span>}
          </h2>
          {usuario.carrera && (
            <div className="flex items-center gap-2 mt-1">
              <GraduationCap size={20} />
              <span>
                {usuario.carrera}
                {usuario.semestre && ` • ${usuario.semestre}° semestre`}
              </span>
            </div>
          )}
          {usuario.perfil?.bio && (
            <p className="mt-2 text-gray-200">{usuario.perfil.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
}
