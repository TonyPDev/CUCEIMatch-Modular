// frontend/src/pages/Swipe.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { matchesService } from "../services/matches";
import SwipeCard from "../components/SwipeCard";
import MatchAnimation from "../components/MatchAnimation";

export default function Swipe() {
  const navigate = useNavigate();
  const [candidatos, setCandidatos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchInfo, setMatchInfo] = useState(null);

  useEffect(() => {
    cargarCandidatos();
  }, []);

  const cargarCandidatos = async () => {
    setLoading(true);
    try {
      const data = await matchesService.getCandidatos();
      console.log("Datos de candidatos recibidos:", data);

      // El backend puede devolver { candidatos: [...], total: N }
      const candidatosArray = data.candidatos || data.results || data || [];
      console.log("Candidatos procesados:", candidatosArray);

      setCandidatos(candidatosArray);
      setCurrentIndex(0);

      if (candidatosArray.length === 0) {
        toast("No hay candidatos disponibles en este momento", {
          icon: "😅",
        });
      }
    } catch (error) {
      console.error("Error cargando candidatos:", error);
      console.error("Detalles del error:", error.response?.data);
      toast.error("Error al cargar candidatos");
      setCandidatos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (tipo) => {
    const candidatoActual = candidatos[currentIndex];
    if (!candidatoActual) return;

    try {
      const result = await matchesService.hacerSwipe(candidatoActual.id, tipo);

      // Si hay match, mostrar modal
      if (result.match && result.match_data) {
        setMatchInfo(result.match_data);
        setShowMatchModal(true);
      } else if (tipo === "like" || tipo === "superlike") {
        toast.success("¡Like enviado! 💕");
      }

      // Avanzar al siguiente candidato
      if (currentIndex < candidatos.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // No hay más candidatos
        toast("¡Has visto todos los perfiles disponibles!", {
          icon: "🎉",
        });
        navigate("/home");
      }
    } catch (error) {
      console.error("Error en swipe:", error);
      toast.error("Error al hacer swipe");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfiles...</p>
        </div>
      </div>
    );
  }

  const candidatoActual = candidatos[currentIndex];

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

          <h1 className="text-xl font-bold text-gray-800">Descubrir</h1>

          <button
            onClick={cargarCandidatos}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <RefreshCw className="text-gray-600" size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        {candidatoActual ? (
          <>
            <div className="mb-4 text-center text-sm text-gray-600">
              {currentIndex + 1} de {candidatos.length}
            </div>
            <SwipeCard usuario={candidatoActual} onSwipe={handleSwipe} />
          </>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <Sparkles size={64} className="mx-auto text-pink-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              ¡No hay más perfiles!
            </h3>
            <p className="text-gray-600 mb-6">
              Has visto todos los candidatos disponibles por ahora.
            </p>
            <button
              onClick={() => navigate("/home")}
              className="px-6 py-3 bg-gradient-to-r from-brand-purple to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
            >
              Volver al inicio
            </button>
          </div>
        )}
      </div>

      {/* Match Modal */}
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
