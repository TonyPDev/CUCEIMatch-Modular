// frontend/src/pages/Matches.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  Heart,
  User,
  Calendar,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { matchesService } from "../services/matches";

export default function Matches() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarMatches();
  }, []);

  const cargarMatches = async () => {
    setLoading(true);
    try {
      const data = await matchesService.getMisMatches();
      console.log("Datos de matches recibidos:", data);
      // El backend puede devolver un array directamente o un objeto con results
      const matchesArray = Array.isArray(data) ? data : data.results || [];
      setMatches(matchesArray);
    } catch (error) {
      console.error("Error cargando matches:", error);
      toast.error("Error al cargar matches");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarMatch = async (matchId, nombreUsuario) => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres eliminar el match con ${nombreUsuario}?`
      )
    ) {
      return;
    }

    try {
      await matchesService.eliminarMatch(matchId);
      toast.success("Match eliminado");
      setMatches(matches.filter((m) => m.id !== matchId));
    } catch (error) {
      console.error("Error eliminando match:", error);
      toast.error("Error al eliminar match");
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const date = new Date(fecha);
    const ahora = new Date();
    const diff = ahora - date;
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (dias === 0) return "Hoy";
    if (dias === 1) return "Ayer";
    if (dias < 7) return `Hace ${dias} días`;
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate("/home")}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft className="text-gray-600" size={24} />
          </button>

          <h1 className="text-xl font-bold text-gray-800">Mis Matches</h1>

          <div className="w-10" />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {matches.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <Heart size={64} className="mx-auto text-pink-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Aún no tienes matches
            </h3>
            <p className="text-gray-600 mb-6">
              Empieza a deslizar y encuentra personas con las que conectar
            </p>
            <button
              onClick={() => navigate("/swipe")}
              className="px-6 py-3 bg-gradient-to-r from-brand-purple to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
            >
              Comenzar a buscar
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onEliminar={handleEliminarMatch}
                onIrChat={() => navigate(`/chat/${match.id}`)}
                formatearFecha={formatearFecha}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MatchCard({ match, onEliminar, onIrChat, formatearFecha }) {
  const otroUsuario = match.otro_usuario;
  const fotoPrincipal =
    otroUsuario?.fotos?.find((f) => f.es_principal) || otroUsuario?.fotos?.[0];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="flex">
        {/* Foto */}
        <div className="w-32 h-32 flex-shrink-0">
          {fotoPrincipal ? (
            <img
              src={fotoPrincipal.imagen_url}
              alt={otroUsuario.nombre_completo}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
              <User size={48} className="text-gray-400" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {otroUsuario.nombre_completo}
                  {otroUsuario.edad && (
                    <span className="text-gray-600 font-normal">
                      , {otroUsuario.edad}
                    </span>
                  )}
                </h3>
                {otroUsuario.carrera && (
                  <p className="text-sm text-gray-600">{otroUsuario.carrera}</p>
                )}
              </div>

              {/* Badge de mensajes no leídos */}
              {match.mensajes_no_leidos > 0 && (
                <span className="px-2 py-1 bg-pink-500 text-white text-xs font-bold rounded-full">
                  {match.mensajes_no_leidos}
                </span>
              )}
            </div>

            {/* Último mensaje */}
            {match.ultimo_mensaje_preview && (
              <p className="text-sm text-gray-500 line-clamp-1">
                {match.ultimo_mensaje_preview.contenido}
              </p>
            )}
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar size={14} />
              <span>
                {match.ultimo_mensaje
                  ? formatearFecha(match.ultimo_mensaje)
                  : formatearFecha(match.fecha)}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onIrChat}
                className="px-4 py-2 bg-gradient-to-r from-brand-purple to-pink-500 text-white rounded-lg font-semibold hover:shadow-md transition text-sm flex items-center gap-2"
              >
                <MessageCircle size={16} />
                Chatear
              </button>

              <button
                onClick={() =>
                  onEliminar(match.id, otroUsuario.nombre_completo)
                }
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                title="Eliminar match"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
