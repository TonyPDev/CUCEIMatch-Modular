import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, X } from "lucide-react";
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
      {/* Contenido principal con flex-grow para empujar el footer abajo */}
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Lado Izquierdo - Bienvenida */}
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

        {/* Lado Derecho - Formulario */}
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

      {/* Footer pegado al fondo */}
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

      {/* Modal de Política de Privacidad */}
      {showPrivacyModal && (
        <Modal
          onClose={() => setShowPrivacyModal(false)}
          title="Política de Privacidad"
        >
          <div className="space-y-4 text-gray-700">
            <p className="font-semibold text-lg text-brand-purple">
              Última actualización: Octubre 2025
            </p>

            <section>
              <h3 className="font-bold text-lg mb-2">
                1. Información que Recopilamos
              </h3>
              <p>En CUCEI Match recopilamos la siguiente información:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Datos de tu credencial de estudiante (código QR)</li>
                <li>Nombre completo y carrera</li>
                <li>Fotografías de perfil</li>
                <li>Intereses, hobbies y preferencias</li>
                <li>Información de conversaciones dentro de la plataforma</li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">
                2. Uso de la Información
              </h3>
              <p>Utilizamos tu información para:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Verificar tu identidad como estudiante de CUCEI</li>
                <li>Crear y mantener tu perfil</li>
                <li>Facilitar conexiones con otros estudiantes</li>
                <li>Mejorar nuestros servicios</li>
                <li>Garantizar la seguridad de la plataforma</li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">3. Protección de Datos</h3>
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para
                proteger tus datos personales contra accesos no autorizados,
                pérdida o alteración.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">
                4. Compartir Información
              </h3>
              <p>
                No compartimos tu información personal con terceros, excepto
                cuando sea necesario para el funcionamiento de la plataforma o
                cuando la ley lo requiera.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">5. Tus Derechos</h3>
              <p>Tienes derecho a:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Acceder a tu información personal</li>
                <li>Corregir datos inexactos</li>
                <li>Solicitar la eliminación de tu cuenta</li>
                <li>Oponerte al procesamiento de tus datos</li>
              </ul>
            </section>
          </div>
        </Modal>
      )}

      {/* Modal de Términos y Condiciones */}
      {showTermsModal && (
        <Modal
          onClose={() => setShowTermsModal(false)}
          title="Términos y Condiciones"
        >
          <div className="space-y-4 text-gray-700">
            <p className="font-semibold text-lg text-brand-purple">
              Última actualización: Octubre 2025
            </p>

            <section>
              <h3 className="font-bold text-lg mb-2">
                1. Aceptación de Términos
              </h3>
              <p>
                Al acceder y usar CUCEI Match, aceptas estar sujeto a estos
                términos y condiciones. Si no estás de acuerdo, no utilices la
                plataforma.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">2. Elegibilidad</h3>
              <p>Para usar CUCEI Match debes:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Ser estudiante activo de CUCEI</li>
                <li>Tener al menos 18 años de edad</li>
                <li>Proporcionar información verídica</li>
                <li>Mantener la confidencialidad de tu cuenta</li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">
                3. Conducta del Usuario
              </h3>
              <p>Los usuarios se comprometen a:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Tratar a otros usuarios con respeto</li>
                <li>No compartir contenido ofensivo o inapropiado</li>
                <li>No acosar, intimidar o amenazar a otros</li>
                <li>No hacerse pasar por otra persona</li>
                <li>No usar la plataforma con fines comerciales</li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">
                4. Contenido del Usuario
              </h3>
              <p>
                Eres responsable del contenido que compartes. CUCEI Match se
                reserva el derecho de eliminar contenido que viole estos
                términos.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">
                5. Suspensión y Terminación
              </h3>
              <p>
                Podemos suspender o terminar tu cuenta si violas estos términos,
                sin previo aviso y sin responsabilidad.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">
                6. Limitación de Responsabilidad
              </h3>
              <p>
                CUCEI Match no se hace responsable por las interacciones entre
                usuarios fuera de la plataforma. Usa tu criterio y precaución al
                conocer personas.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">
                7. Propiedad Intelectual
              </h3>
              <p>
                Todo el contenido de la plataforma, incluyendo diseño, código y
                marca, es propiedad de CUCEI Match.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">8. Modificaciones</h3>
              <p>
                Nos reservamos el derecho de modificar estos términos en
                cualquier momento. Los cambios serán efectivos al publicarse en
                la plataforma.
              </p>
            </section>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Componente Modal reutilizable
const Modal = ({ onClose, title, children }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-brand-purple to-pink-500">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-brand-purple to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
