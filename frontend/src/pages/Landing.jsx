import { useNavigate } from "react-router-dom";
import { Heart, Users, MessageCircle, QrCode } from "lucide-react";
import logo from "../assets/logo.svg";
import Leonel from "../assets/Leonel-match.webp";
import chatimg from "../assets/Chat.webp";
import tolin from "../assets/tolin_cesar.png";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-6">
          <div className="w-56 h-20 flex items-center justify-center">
            <img
              src={logo}
              alt="CUCEI Match Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate("/validate-qr")}
            className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
          >
            Registrarse
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Sin pre-requisitos,
            <br />
            Sin trámites,
            <br />
            <span className="text-pink-500">Solo amor directo</span>
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Encuentra a alguien que entienda tus desvelos, tus parciales y tu
            amor por el estudio. Aquí no hay requerimientos ni listas de espera,
            solo conexiones genuinas.
          </p>
          <button
            onClick={() => navigate("/validate-qr")}
            className="px-8 py-4 bg-purple-900 text-white rounded-lg hover:bg-purple-800 transition text-lg font-semibold"
          >
            Empieza a buscar!!
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Para estudiantes de CUCEI
            <br />
            Recurre sin problemas
          </p>
        </div>

        <div className="relative">
          <div>
            <img src={tolin} alt="Estudiantes" className="rounded-2xl w-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-4xl font-bold text-center mb-12">
            Nos importan tus intereses
          </h3>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Los intereses particulares ayudan a encontrar personas.
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-pink-100 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                <Users className="w-12 h-12 text-pink-500" />
              </div>
              <h4 className="font-semibold mb-2">Signo zodiacal</h4>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-pink-100 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-12 h-12 text-pink-500" />
              </div>
              <h4 className="font-semibold mb-2">Hobbies</h4>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-pink-100 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-pink-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">Licenciatura</h4>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-pink-100 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-pink-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">Habilidades</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Swipe Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h3 className="text-4xl font-bold mb-6 text-center">Swipe ✓</h3>
          <p className="text-gray-600 mb-6 text-lg">
            Conecta con un simple movimiento deslizando a la derecha y espera un
            match o desliza a la izquierda y sigue explorando.
          </p>
          <div className="space-y-4 ">
            <div className="flex items-center gap-3 ">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center ">
                <span className="text-2xl ">👎</span>
              </div>
              <span className="text-gray-700">NOPE - No es tu tipo</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👍</span>
              </div>
              <span className="text-gray-700">LIKE - Te interesa</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <img src={Leonel} alt="Swipe demo" className="" />
        </div>
      </section>

      {/* Chat Section */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <img src={chatimg} alt="Chat demo" className="rounded-2xl" />
            </div>
          </div>

          <div>
            <h3 className="text-4xl font-bold mb-6">Mensajería 💌</h3>
            <p className="text-gray-600 mb-6 text-lg">
              Ten conversaciones y conoce personas, descubre la personalidad de
              tu match o planea una reunión para llevarlo fuera de lo virtual.
            </p>
          </div>
        </div>
      </section>

      {/* QR Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="bg-white rounded-3xl shadow-xl p-12">
          <h3 className="text-4xl font-bold mb-6">Nos importas 🔒</h3>
          <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
            Nuestra prioridad es la seguridad de los usuarios, es importante
            verificar tu identidad y pertenencia al centro universitario CUCEI
            por medio del código QR de tu credencial estudiantil.
          </p>
          <div className="inline-block p-8 bg-pink-50 rounded-2xl">
            <QrCode className="w-32 h-32 text-pink-500 mx-auto" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-pink-500 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-pink-500 font-bold text-xl">CM</span>
            </div>
            <span className="text-2xl font-bold">CUCEI MATCH</span>
          </div>
          <div className="flex justify-center gap-8 mb-4">
            <a href="#" className="hover:underline">
              Política de privacidad
            </a>
            <a href="#" className="hover:underline">
              Términos y condiciones
            </a>
          </div>
          <p className="text-pink-100">
            © 2025 CUCEI MATCH | Derechos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}
