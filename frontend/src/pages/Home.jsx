import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Camera,
  Mail,
  Cake,
  GraduationCap,
  Calendar,
  Trash2,
  Sparkles,
  RefreshCw,
  X, // Importar el ícono X
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { authService } from "../services/auth";
import { matchesService } from "../services/matches";
import toast from "react-hot-toast";
import logo from "../assets/logo.svg";
import SwipeCard from "../components/SwipeCard";
import MatchAnimation from "../components/MatchAnimation";

// Componente para la tarjeta de Match (integrado desde Matches.jsx)
function MatchCard({ match, onEliminar, onIrChat, formatearFecha }) {
  const otroUsuario = match.otro_usuario;
  const fotoPrincipal =
    otroUsuario?.fotos?.find((f) => f.es_principal) || otroUsuario?.fotos?.[0];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="flex">
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
              {match.mensajes_no_leidos > 0 && (
                <span className="px-2 py-1 bg-pink-500 text-white text-xs font-bold rounded-full">
                  {match.mensajes_no_leidos}
                </span>
              )}
            </div>
            {match.ultimo_mensaje_preview && (
              <p className="text-sm text-gray-500 line-clamp-1">
                {match.ultimo_mensaje_preview.contenido}
              </p>
            )}
          </div>
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
                <MessageCircle size={16} /> Chatear
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

export default function Home() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("swipe");

  // State para Swipe
  const [candidatos, setCandidatos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchInfo, setMatchInfo] = useState(null);
  const [loadingCandidatos, setLoadingCandidatos] = useState(true);

  // State para Matches
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  // --- LÓGICA DE DATOS ---
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await authService.getPerfil();
        updateUser(userData);
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Error al cargar tus datos");
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
    cargarCandidatos();
    cargarMatches();
  }, [updateUser]);

  const cargarCandidatos = async () => {
    setLoadingCandidatos(true);
    try {
      const data = await matchesService.getCandidatos();
      const candidatosArray = data.candidatos || data.results || data || [];
      setCandidatos(candidatosArray);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error cargando candidatos:", error);
      toast.error("Error al cargar candidatos");
      setCandidatos([]);
    } finally {
      setLoadingCandidatos(false);
    }
  };

  const cargarMatches = async () => {
    setLoadingMatches(true);
    try {
      const data = await matchesService.getMisMatches();
      const matchesArray = Array.isArray(data) ? data : data.results || [];
      setMatches(matchesArray);
    } catch (error) {
      console.error("Error cargando matches:", error);
      toast.error("Error al cargar matches");
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleSwipe = async (tipo) => {
    const candidatoActual = candidatos[currentIndex];
    if (!candidatoActual) return;
    try {
      const result = await matchesService.hacerSwipe(candidatoActual.id, tipo);
      if (result.match && result.match_data) {
        setMatchInfo(result.match_data);
        setShowMatchModal(true);
        cargarMatches(); // Recargar matches si hay uno nuevo
      }
      if (currentIndex < candidatos.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        toast("¡Has visto todos los perfiles!", { icon: "🎉" });
        // Opcional: recargar candidatos
        cargarCandidatos();
      }
    } catch (error) {
      console.error("Error en swipe:", error);
      toast.error("Error al hacer swipe");
    }
  };

  const handleEliminarMatch = async (matchId, nombreUsuario) => {
    if (
      !window.confirm(
        `¿Seguro que quieres eliminar el match con ${nombreUsuario}?`
      )
    )
      return;
    try {
      await matchesService.eliminarMatch(matchId);
      toast.success("Match eliminado");
      setMatches(matches.filter((m) => m.id !== matchId));
    } catch (error) {
      toast.error("Error al eliminar match");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    navigate("/");
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
    return date.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-background">
      <header className="bg-white shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <img src={logo} alt="CUCEI Match" className="h-12" />
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/settings")}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <Settings className="text-gray-600" size={24} />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <LogOut className="text-gray-600" size={24} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                  {user?.fotos && user.fotos.length > 0 ? (
                    <img
                      src={
                        user.fotos.find((f) => f.es_principal)?.imagen_url ||
                        user.fotos[0].imagen_url
                      }
                      alt={user.nombre_completo}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-gray-400" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-brand-purple text-white rounded-full flex items-center justify-center hover:bg-brand-purple-dark transition">
                  <Camera size={20} />
                </button>
              </div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {user?.nombre_completo}
                </h2>
                <p className="text-gray-600">@{user?.username}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail size={18} />{" "}
                  <span className="text-sm">{user?.email}</span>
                </div>
                {user?.edad && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Cake size={18} />{" "}
                    <span className="text-sm">{user.edad} años</span>
                  </div>
                )}
                {user?.carrera && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <GraduationCap size={18} />{" "}
                    <span className="text-sm">{user.carrera}</span>
                  </div>
                )}
              </div>
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="w-full py-2 border-2 border-brand-purple text-brand-purple rounded-xl font-semibold hover:bg-brand-purple hover:text-white transition"
                >
                  Editar perfil
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2">
              <button
                onClick={() => setActiveTab("swipe")}
                className={`flex-1 py-3 rounded-xl font-semibold transition ${
                  activeTab === "swipe"
                    ? "bg-brand-purple text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Heart className="inline mr-2" size={20} /> Descubrir
              </button>
              <button
                onClick={() => setActiveTab("matches")}
                className={`flex-1 py-3 rounded-xl font-semibold transition ${
                  activeTab === "matches"
                    ? "bg-brand-purple text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <MessageCircle className="inline mr-2" size={20} /> Matches
              </button>
            </div>

            {/* --- CAMBIO AQUÍ --- */}
            {activeTab === "swipe" && (
              <div className="flex items-end justify-center gap-4">
                <button
                  onClick={() => handleSwipe("dislike")}
                  className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 mb-24"
                  disabled={loadingCandidatos || !candidatos[currentIndex]}
                >
                  <X size={40} className="text-red-500" />
                </button>
                <div className="w-full max-w-md">
                  {loadingCandidatos ? (
                    <div className="flex items-center justify-center h-[600px]">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
                    </div>
                  ) : candidatos[currentIndex] ? (
                    <SwipeCard usuario={candidatos[currentIndex]} />
                  ) : (
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center mt-10">
                      <Sparkles
                        size={64}
                        className="mx-auto text-pink-400 mb-4"
                      />
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">
                        No hay más perfiles
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Vuelve más tarde para ver nuevos candidatos.
                      </p>
                      <button
                        onClick={cargarCandidatos}
                        className="px-6 py-3 bg-gradient-to-r from-brand-purple to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2 mx-auto"
                      >
                        <RefreshCw size={18} /> Volver a cargar
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleSwipe("like")}
                  className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 mb-24"
                  disabled={loadingCandidatos || !candidatos[currentIndex]}
                >
                  <Heart size={40} className="text-pink-500" />
                </button>
              </div>
            )}

            {activeTab === "matches" && (
              <div className="space-y-4">
                {loadingMatches ? (
                  <div className="min-h-[400px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
                  </div>
                ) : matches.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <MessageCircle
                      size={64}
                      className="mx-auto text-pink-400 mb-4"
                    />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      Aún no tienes matches
                    </h3>
                    <p className="text-gray-600">
                      Cuando le gustes a alguien de vuelta, aparecerá aquí.
                    </p>
                  </div>
                ) : (
                  matches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onEliminar={handleEliminarMatch}
                      onIrChat={() => navigate(`/chat/${match.id}`)}
                      formatearFecha={formatearFecha}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {showMatchModal && matchInfo && (
        <MatchAnimation
          matchInfo={matchInfo}
          onClose={() => {
            setShowMatchModal(false);
            setMatchInfo(null);
          }}
        />
      )}
    </div>
  );
}
