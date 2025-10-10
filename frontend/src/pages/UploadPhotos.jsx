import { useEffect, useRef } from "react"; // 1. Importa useRef
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { perfilesService } from "../services/perfiles";
import logo from "../assets/logo.svg";

export default function UploadPhotos() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fotos } = location.state || { fotos: [] };

  // 2. Crea una referencia para controlar la ejecución
  const uploadStarted = useRef(false);

  useEffect(() => {
    // 3. Comprueba si la subida ya ha comenzado
    if (uploadStarted.current) {
      return;
    }

    // 4. Marca que la subida ha comenzado
    uploadStarted.current = true;

    if (fotos.length === 0) {
      toast.error("No hay fotos para subir. Redirigiendo al home...");
      navigate("/home");
      return;
    }

    const subirTodasLasFotos = async () => {
      const toastId = toast.loading(`Subiendo ${fotos.length} foto(s)...`);

      try {
        await Promise.all(fotos.map((foto) => perfilesService.subirFoto(foto)));

        toast.success("¡Fotos subidas con éxito!", { id: toastId });
        navigate("/home");
      } catch (error) {
        console.error("Error al subir fotos:", error);
        toast.error("Hubo un error al subir tus fotos.", { id: toastId });
        navigate("/home");
      }
    };

    subirTodasLasFotos();
  }, [fotos, navigate]);

  return (
    <div className="min-h-screen bg-brand-background flex flex-col items-center justify-center p-4">
      <img
        src={logo}
        alt="CUCEI Match Logo"
        className="w-48 md:w-56 lg:w-64 object-contain mb-8"
      />
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      <p className="text-gray-700 text-lg mt-4">
        Procesando tus fotos, por favor espera...
      </p>
    </div>
  );
}
