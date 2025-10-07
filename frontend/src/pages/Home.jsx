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
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { authService } from "../services/auth";
import toast from "react-hot-toast";
import logo from "../assets/logo.svg";

export default function Home() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("perfil"); // perfil, swipe, matches

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
  }, [updateUser]);

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-background">
      {/* Header */}
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
          {/* Sidebar - Perfil */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              {/* Foto de perfil */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                  {user?.fotos && user.fotos.length > 0 ? (
                    <img
                      src={user.fotos[0].imagen_url}
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

              {/* Info del usuario */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {user?.nombre_completo}
                </h2>
                <p className="text-gray-600">@{user?.username}</p>
              </div>

              {/* Datos adicionales */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail size={18} />
                  <span className="text-sm">{user?.email}</span>
                </div>
                {user?.edad && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Cake size={18} />
                    <span className="text-sm">{user.edad} años</span>
                  </div>
                )}
                {user?.carrera && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <GraduationCap size={18} />
                    <span className="text-sm">{user.carrera}</span>
                  </div>
                )}
              </div>

              {/* Botones de acción */}
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

          {/* Contenido principal */}
          <div className="md:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2">
              <button
                onClick={() => setActiveTab("swipe")}
                className={`flex-1 py-3 rounded-xl font-semibold transition ${
                  activeTab === "swipe"
                    ? "bg-brand-purple text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Heart className="inline mr-2" size={20} />
                Descubrir
              </button>
              <button
                onClick={() => setActiveTab("matches")}
                className={`flex-1 py-3 rounded-xl font-semibold transition ${
                  activeTab === "matches"
                    ? "bg-brand-purple text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <MessageCircle className="inline mr-2" size={20} />
                Matches
              </button>
            </div>

            {/* Contenido según tab activa */}
            {activeTab === "swipe" && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <Heart size={64} className="mx-auto text-pink-400 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  ¡Empieza a descubrir!
                </h3>
                <p className="text-gray-600 mb-6">
                  Encuentra personas increíbles de CUCEI
                </p>
                <button
                  onClick={() => navigate("/swipe")}
                  className="px-8 py-3 bg-gradient-to-r from-brand-purple to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
                >
                  Comenzar a deslizar
                </button>
              </div>
            )}

            {activeTab === "matches" && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Tus Matches
                </h3>
                <div className="text-center py-12">
                  <MessageCircle
                    size={64}
                    className="mx-auto text-gray-300 mb-4"
                  />
                  <p className="text-gray-500">
                    Aún no tienes matches. ¡Empieza a deslizar!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
