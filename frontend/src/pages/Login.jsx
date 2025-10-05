import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "../services/auth";
import { useAuthStore } from "../stores/authStore";
import logo from "../assets/logo.svg";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Login
      const tokens = await authService.login(formData.email, formData.password);

      // Obtener datos del usuario
      const userData = await authService.getPerfil();

      // Guardar en store
      setAuth(userData, tokens);

      toast.success("¡Bienvenido de vuelta!");
      navigate("/home");
    } catch (error) {
      console.error("Error login:", error);
      toast.error(
        error.response?.data?.detail || "Email o contraseña incorrectos"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex">
      {/* Left Side - Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-pink-500 p-12 flex-col justify-between">
        <div>
          <div className="flex justify-center mb-8">
            <img
              src={logo}
              alt="CUCEI Match Logo"
              className="w-48 md:w-56 lg:w-64 object-contain"
            />
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-white mb-6">
              ¡Bienvenido a CUCEIMatch!
            </h2>
            <p className="text-pink-100 text-lg">
              Inicia sesión para descubrir y conectar con personas de tu
              universidad. 🎓
            </p>
          </div>
        </div>

        <div className="text-pink-100 text-sm">
          <a href="#" className="hover:text-white mr-4">
            Política de privacidad
          </a>
          <a href="#" className="hover:text-white">
            Términos y condiciones
          </a>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo móvil */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-pink-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CM</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">CUCEI MATCH</h1>
              <p className="text-xs text-gray-600">
                UNIVERSITY STUDENT 💛 DATING PLATFORM
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Ingresa tus datos
            </h2>
            <p className="text-gray-600 mb-8">Inicia sesión en tu cuenta</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-purple-900 text-white rounded-xl font-semibold hover:bg-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Iniciando sesión..." : "Enviar"}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-3">
              <Link
                to="/validate-qr"
                className="block text-pink-600 hover:text-pink-700 font-semibold"
              >
                Regístrate ahora.
              </Link>

              <button className="text-gray-600 hover:text-gray-800 text-sm">
                ¿Olvidaste tu contraseña? Recupérala aquí.
              </button>
            </div>
          </div>

          {/* Botón de volver */}
          <Link
            to="/"
            className="block text-center mt-6 text-gray-600 hover:text-gray-800"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
