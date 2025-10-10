import { Heart, MessageCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MatchAnimation({ matchInfo, onClose }) {
  const navigate = useNavigate();
  const otroUsuario = matchInfo?.otro_usuario;
  const fotoPrincipal =
    otroUsuario?.fotos?.find((f) => f.es_principal) || otroUsuario?.fotos?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-pink-500/90 to-purple-500/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
        {/* Header con botón cerrar */}
        <div className="relative p-4 flex justify-end">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Contenido principal */}
        <div className="px-8 pb-8 text-center">
          {/* Icono animado */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-pink-200 rounded-full animate-ping opacity-75"></div>
            </div>
            <div className="relative">
              <Heart
                size={120}
                className="mx-auto text-pink-500 fill-pink-500 animate-pulse drop-shadow-lg"
              />
            </div>
          </div>

          {/* Título */}
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-4">
            ¡Es un Match!
          </h2>

          {/* Foto del otro usuario */}
          {fotoPrincipal && (
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-pink-300 shadow-xl mb-4">
              <img
                src={fotoPrincipal.imagen_url}
                alt={otroUsuario.nombre_completo}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Mensaje */}
          <p className="text-gray-700 text-lg mb-8">
            A ti y a{" "}
            <strong className="text-pink-600">
              {otroUsuario?.nombre_completo || "esta persona"}
            </strong>{" "}
            les gustaron mutuamente 💕
          </p>

          {/* Botones de acción */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/chat/${matchInfo.id}`)}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Enviar mensaje
            </button>

            <button
              onClick={onClose}
              className="w-full py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Seguir buscando
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
