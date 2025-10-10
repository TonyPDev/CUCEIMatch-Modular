import { useNavigate } from "react-router-dom";
import { Heart, Users, QrCode, Sparkles, X } from "lucide-react";
import logo from "../assets/logo.svg";
import leonelMatch from "../assets/Leonel-match.webp";
import chatImg from "../assets/Chat.webp";
import tolinCesar from "../assets/tolin_cesar.png";
import { useState } from "react";
import Modal from "../components/Modal";
import { PrivacyPolicy, TermsAndConditions } from "../components/LegalContent";

export default function Landing() {
  const navigate = useNavigate();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <div className="bg-brand-background">
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-lg border-b border-pink-100">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center">
            <img
              src={logo}
              alt="CUCEI Match Logo"
              className="h-10 sm:h-12 md:h-14 lg:h-16 transition-transform hover:scale-105"
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 hover:text-brand-purple font-medium transition-all hover:scale-105"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate("/validate-qr")}
              className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-brand-purple to-brand-purple-light text-white rounded-full hover:shadow-xl font-semibold transition-all hover:scale-105 hover:-translate-y-0.5"
            >
              Registrarse
            </button>
          </div>
        </div>
      </header>
      <div className="relative min-h-screen bg-gradient-to-br from-white via-pink-50 to-brand-pink-mid overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>

        <section className="relative min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          <div className="order-1 lg:order-2 flex justify-center items-center w-full">
            <div className="relative w-full flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-purple-300 rounded-3xl blur-2xl opacity-30 transform scale-110"></div>
              <img
                src={tolinCesar}
                alt="Estudiantes de CUCEI"
                className="relative max-h-[45vh] sm:max-h-[50vh] md:max-h-[55vh] lg:max-h-[85vh] w-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          <div className="order-2 lg:order-1 text-center lg:text-left space-y-4 sm:space-y-6 w-full flex flex-col items-center lg:items-start">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold flex flex-col gap-2 text-blue-950 font-serif leading-tight">
              <span
                className="inline-block transform hover:scale-105 transition-transform"
                style={{
                  textShadow:
                    "2px 2px 0px #EC939F, 4px 4px 0px rgba(236, 147, 159, 0.3)",
                }}
              >
                <span
                  style={{ textShadow: "2px 2px 0px #172554" }}
                  className="text-brand-pink-text"
                >
                  S
                </span>
                in pre-requisitos,
              </span>
              <span
                className="inline-block transform hover:scale-105 transition-transform"
                style={{
                  textShadow:
                    "2px 2px 0px #EC939F, 4px 4px 0px rgba(236, 147, 159, 0.3)",
                }}
              >
                <span
                  style={{ textShadow: "2px 2px 0px #172554" }}
                  className="text-brand-pink-text"
                >
                  S
                </span>
                in trámites,
              </span>
              <span
                className="inline-block transform hover:scale-105 transition-transform"
                style={{
                  textShadow:
                    "2px 2px 0px #EC939F, 4px 4px 0px rgba(236, 147, 159, 0.3)",
                }}
              >
                <span
                  style={{ textShadow: "2px 2px 0px #172554" }}
                  className="text-brand-pink-text"
                >
                  S
                </span>
                olo amor directo.
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Encuentra a alguien que entienda tus desvelos, tus parciales y tu
              amor por el estudio. Aquí no hay requerimientos ni listas de
              espera, solo conexiones genuinas.
            </p>

            <div className="flex flex-col items-center lg:items-start gap-3 pt-2 w-full">
              <button
                onClick={() => navigate("/validate-qr")}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-brand-purple to-brand-purple-light text-white rounded-xl hover:shadow-2xl transition-all text-base sm:text-lg font-semibold transform hover:scale-105 hover:-translate-y-1"
              >
                ¡Empieza a buscar!
              </button>

              <p className="text-xs sm:text-sm text-gray-500 text-center lg:text-left">
                Exclusivo para estudiantes de CUCEI
              </p>

              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className="hover:text-brand-purple transition-colors underline"
                >
                  Política de privacidad
                </button>
                <span className="text-gray-400">•</span>
                <button
                  onClick={() => setShowTermsModal(true)}
                  className="hover:text-brand-purple transition-colors underline"
                >
                  Términos y condiciones
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Intereses Section*/}
      <section className="bg-gradient-to-b from-brand-background to-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
              Nos importan tus intereses
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Los intereses particulares ayudan a encontrar personas con gustos
              similares para una conexión más profunda.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <FeatureCard
              icon={
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-brand-pink-dark" />
              }
              title="Orientación"
            />
            <FeatureCard
              icon={
                <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-brand-pink-dark" />
              }
              title="Hobbies"
            />
            <FeatureCard icon={<GraduationCapIcon />} title="Licenciatura" />
            <FeatureCard icon={<StarIcon />} title="Habilidades" />
          </div>
        </div>
      </section>
      {/* Swipe Section */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="text-center md:text-left order-2 md:order-1">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
              Swipe ✓
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
              Conecta con un simple movimiento. Desliza a la derecha si te
              interesa y espera un match, o desliza a la izquierda y sigue
              explorando perfiles.
            </p>
            <div className="space-y-4 flex flex-col items-center md:items-start">
              <div className="flex items-center gap-4 bg-red-50 p-4 rounded-2xl w-full max-w-sm hover:scale-105 transition-transform">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl sm:text-3xl">👎</span>
                </div>
                <span className="text-sm sm:text-base text-gray-700 font-medium">
                  NOPE - No es tu tipo
                </span>
              </div>
              <div className="flex items-center gap-4 bg-green-50 p-4 rounded-2xl w-full max-w-sm hover:scale-105 transition-transform">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl sm:text-3xl">👍</span>
                </div>
                <span className="text-sm sm:text-base text-gray-700 font-medium">
                  LIKE - Te interesa
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center order-1 md:order-2">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl blur-2xl opacity-40"></div>
              <img
                src={leonelMatch}
                alt="Demostración de swipe"
                className="relative w-full max-w-xs sm:max-w-sm md:max-w-md  hover:rotate-2 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Chat Section*/}
      <section className="bg-gradient-to-b from-white to-pink-50 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="relative flex justify-center order-2 md:order-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 rounded-3xl blur-2xl opacity-40"></div>
            <img
              src={chatImg}
              alt="Demostración de chat"
              className="relative rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-sm transform hover:-rotate-2 transition-transform duration-300"
            />
          </div>
          <div className="text-center md:text-left order-1 md:order-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
              Mensajería 💌
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Ten conversaciones y conoce personas. Descubre la personalidad de
              tu match o planea una reunión para llevarlo fuera de lo virtual.
            </p>
          </div>
        </div>
      </section>
      {/* Security Section o */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-pink-50 via-white to-purple-50 rounded-3xl sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-10 lg:p-12 border border-pink-100">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-center text-gray-900">
              Nos importas 🔒
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto leading-relaxed">
              Nuestra prioridad es la seguridad. Verificamos tu identidad y
              pertenencia a CUCEI por medio del código QR de tu credencial de
              estudiante.
            </p>
            <div className="flex justify-center">
              <div className="inline-block p-6 sm:p-8 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl shadow-lg transform hover:scale-105 transition-transform">
                <QrCode className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 text-pink-600 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gradient-to-br from-white via-pink-50 to-brand-pink-light py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl shadow-md flex items-center justify-center">
                <span className="text-brand-pink-dark font-bold text-lg sm:text-xl">
                  CM
                </span>
              </div>
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-brand-purple to-pink-600 bg-clip-text text-transparent">
                CUCEI MATCH
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-sm sm:text-base text-brand-pink-dark">
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="hover:text-brand-purple transition-colors text-center"
              >
                Política de privacidad
              </button>
              <button
                onClick={() => setShowTermsModal(true)}
                className="hover:text-brand-purple transition-colors text-center"
              >
                Términos y condiciones
              </button>
            </div>

            <p className="text-brand-pink-dark text-xs sm:text-sm">
              © 2025 CUCEI MATCH - Hecho con ❤️ para la comunidad CUCEI
            </p>
          </div>
        </div>
      </footer>
      {/* Modal de Política de Privacidad */}
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

const FeatureCard = ({ icon, title }) => (
  <div className="group text-center flex flex-col items-center p-4 rounded-2xl hover:bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-brand-pink-light to-pink-200 rounded-3xl mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
      {icon}
    </div>
    <h3 className="font-semibold text-base sm:text-lg text-gray-800">
      {title}
    </h3>
  </div>
);

// Íconos SVG
const GraduationCapIcon = () => (
  <svg
    className="w-10 h-10 sm:w-12 sm:h-12 text-brand-pink-dark"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
  </svg>
);

const StarIcon = () => (
  <svg
    className="w-10 h-10 sm:w-12 sm:h-12 text-brand-pink-dark"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);
