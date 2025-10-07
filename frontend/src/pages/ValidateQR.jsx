import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { QrCode, Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "../services/auth";
import logo from "../assets/logo.svg";

export default function ValidateQR() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);

  // Agregar estilos personalizados para centrar el scanner
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      #qr-reader {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      
      #qr-reader__dashboard_section {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
      }
      
      #qr-reader__dashboard_section_swaplink,
      #qr-reader__dashboard_section_csr {
        text-align: center;
        display: flex;
        justify-content: center;
        width: 100%;
      }
      
      #qr-reader__scan_region {
        margin: 0 auto;
      }
      
      #qr-reader video {
        display: block;
        margin: 0 auto;
      }
      
      #qr-reader__camera_selection {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin: 10px auto;
      }
      
      #qr-reader__filescan_input {
        margin: 0 auto;
        display: block;
        text-align: center;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleValidateQR = async (qrUrl) => {
    setLoading(true);
    try {
      const result = await authService.validarQR(qrUrl);

      if (result.valido) {
        toast.success(`¡Hola ${result.nombre}!`);
        // Navegar a registro con el token
        navigate("/register", {
          state: {
            token_temporal: result.token_temporal,
            nombre: result.nombre,
            vigencia: result.vigencia,
          },
        });
      } else {
        toast.error("Credencial no válida o no eres de CUCEI");
      }
    } catch (error) {
      console.error("Error validando QR:", error);
      if (error.response?.status === 409) {
        toast.error("Esta credencial ya está registrada");
      } else {
        toast.error(
          error.response?.data?.error || "Error al validar la credencial"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualUrl.trim()) {
      handleValidateQR(manualUrl.trim());
    }
  };

  const startQRScanner = () => {
    const html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
    });

    html5QrcodeScanner.render(
      (decodedText) => {
        html5QrcodeScanner.clear();
        handleValidateQR(decodedText);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-8">
            <img
              src={logo}
              alt="CUCEI Match Logo"
              className="w-48 md:w-56 lg:w-64 object-contain"
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-4">
            Para registrarte, escanea el código QR de tu credencial estudiantil
            de CUCEI.
          </h2>

          <p className="text-gray-600 text-center mb-8">
            Este código nos ayudará a verificar que eres un estudiante activo.
            Si todo está en orden, podrás acceder a los servicios y beneficios
            del campus. ¡Es rápido, seguro y fácil!
          </p>

          <h3 className="text-2xl font-bold text-center mb-8">Adjunta tu QR</h3>

          {/* QR Scanner / Manual Input */}
          <div className="space-y-6">
            {!showManualInput ? (
              <div>
                <div id="qr-reader" className="mb-4"></div>

                <button
                  onClick={startQRScanner}
                  disabled={loading}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-brand-purple to-brand-pink-dark text-white rounded-2xl font-semibold hover:from-brand-purple-dark hover:to-brand-pink-mid transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg"
                >
                  <QrCode size={24} />
                  {loading ? "Validando..." : "Escanear QR"}
                </button>

                <div className="text-center mt-4">
                  <button
                    onClick={() => setShowManualInput(true)}
                    className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-2 mx-auto"
                  >
                    <LinkIcon size={20} />O pegar URL manualmente
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL del QR de tu credencial
                  </label>
                  <input
                    type="url"
                    value={manualUrl}
                    onChange={(e) => setManualUrl(e.target.value)}
                    placeholder="https://documentos.udg.mx/..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Pega aquí el enlace que obtienes al escanear el QR
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-brand-purple to-brand-pink-dark hover:from-brand-purple-dark hover:to-brand-pink-mid text-white rounded-xl font-semibold transition disabled:opacity-50"
                >
                  {loading ? "Validando..." : "Enviar"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowManualInput(false)}
                  className="w-full text-gray-600 hover:text-gray-800"
                >
                  ← Volver a escanear
                </button>
              </form>
            )}
          </div>

          {/* Info adicional */}
          <div className="mt-8 p-4 bg-pink-50 rounded-xl">
            <p className="text-sm text-gray-700 text-center">
              💡 <strong>Tip:</strong> El QR se encuentra en el reverso de tu
              credencial estudiantil
            </p>
          </div>
        </div>
        {/* Links */}
        <div className="text-center mt-6 space-y-2">
          <Link to="/login" className="text- text-gray-600 hover:text-gray-800">
            ¿Ya tienes una cuenta? Inicia sesión aquí
          </Link>{" "}
          <br />
          <br />
          <a
            href="#"
            className="text-gray-600 hover:text-gray-800 text-sm mr-4"
          >
            Política de privacidad
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-800 text-sm">
            Términos y condiciones
          </a>
          <p className="text-gray-500 text-sm">© 2025 CUCEI MATCH</p>
        </div>
      </div>
    </div>
  );
}
