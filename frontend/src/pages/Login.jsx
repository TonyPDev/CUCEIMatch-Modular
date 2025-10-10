import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, X } from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "../services/auth";
import { useAuthStore } from "../stores/authStore";
import logo from "../assets/logo.svg";
import Modal from "../components/Modal";
import { PrivacyPolicy, TermsAndConditions } from "../components/LegalContent";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("1️⃣ Iniciando proceso de login...");

      const tokens = await authService.login(formData.email, formData.password);
      console.log("2️⃣ Tokens obtenidos:", {
        hasAccess: !!tokens.access,
        hasRefresh: !!tokens.refresh,
      });

      const savedAccessToken = localStorage.getItem("access_token");
      const savedRefreshToken = localStorage.getItem("refresh_token");
      console.log("3️⃣ Tokens guardados en localStorage:", {
        access: savedAccessToken ? "✅" : "❌",
        refresh: savedRefreshToken ? "✅" : "❌",
      });

      console.log("4️⃣ Obteniendo datos del perfil...");
      const userData = await authService.getPerfil();
      console.log("5️⃣ Datos del perfil obtenidos:", userData);

      setAuth(userData, tokens);
      console.log("6️⃣ Auth store actualizado");

      toast.success("¡Bienvenido de vuelta!");
      console.log("7️⃣ Redirigiendo a /home...");
      navigate("/home");
    } catch (error) {
      console.error("❌ Error en login:", error);
      console.error("❌ Detalles del error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (error.response?.status === 401) {
        toast.error("Email o contraseña incorrectos");
      } else if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Error al iniciar sesión. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background flex flex-col">
      <div className="flex-grow flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center p-8 md:p-12">
          <div className="w-4/6 mb-8">
            <img src={logo} alt="CUCEI Match Logo" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            ¡Bienvenido a CUCEIMatch!
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Inicia sesión para descubrir y conectar con personas de tu
            universidad. 🚀
          </p>
          <Link
            to="/"
            className="px-8 py-3 bg-gradient-to-r from-brand-pink-mid to-brand-pink-dark text-white rounded-lg font-semibold shadow-md hover:opacity-90 transition"
          >
            Ir al inicio
          </Link>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-brand-purple mb-6 text-center">
                Ingresa tus datos
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition"
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-brand-purple-light to-brand-purple text-white rounded-lg font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "Iniciando..." : "Enviar"}
                </button>
              </form>

              <div className="mt-6 text-center space-y-2 text-sm">
                <Link
                  to="/validate-qr"
                  className="text-brand-purple hover:underline font-medium block"
                >
                  Regístrate ahora.
                </Link>
                <button className="text-gray-600 hover:underline">
                  ¿Olvidaste tu contraseña? Recupérala aquí.
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full bg-white border-t border-gray-200 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-gray-500">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="hover:text-brand-purple transition-colors"
            >
              Política de privacidad
            </button>
            <span className="hidden sm:inline">|</span>
            <button
              onClick={() => setShowTermsModal(true)}
              className="hover:text-brand-purple transition-colors"
            >
              Términos y condiciones
            </button>
            <span className="hidden sm:inline">|</span>
            <span>© 2025 CUCEI MATCH</span>
            <span className="hidden sm:inline">|</span>
            <span>Derechos reservados</span>
          </div>
        </div>
      </footer>

      {showPrivacyModal && (
        <Modal
          onClose={() => setShowPrivacyModal(false)}
          title="Política de Privacidad"
        >
          <PrivacyPolicy />
        </Modal>
      )}

      {showTermsModal && (
        <Modal
          onClose={() => setShowTermsModal(false)}
          title="Términos y Condiciones"
        >
          <TermsAndConditions />
        </Modal>
      )}
    </div>
  );
}
