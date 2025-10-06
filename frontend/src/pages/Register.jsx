import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff, Upload, X, Check } from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "../services/auth";
import { useAuthStore } from "../stores/authStore";
import logo from "../assets/logo.svg";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Datos del QR validado
  const { token_temporal, nombre, vigencia } = location.state || {};

  // Si no hay token, redirigir
  if (!token_temporal) {
    navigate("/validate-qr");
    return null;
  }

  const [step, setStep] = useState(1); // 1: datos básicos, 2: fotos y preferencias
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    token_temporal,
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    fecha_nacimiento: { dia: "", mes: "", anio: "" },
    genero: "",
    buscando: "",
    carrera: "",
    semestre: "",
  });

  const [fotos, setFotos] = useState([]);
  const [fotoPreviews, setFotoPreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFechaNacimiento = (campo, valor) => {
    setFormData((prev) => ({
      ...prev,
      fecha_nacimiento: { ...prev.fecha_nacimiento, [campo]: valor },
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (fotos.length + files.length > 6) {
      toast.error("Máximo 6 fotos");
      return;
    }

    setFotos((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
    setFotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitStep1 = (e) => {
    e.preventDefault();

    // Validaciones
    if (formData.password !== formData.password_confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    const { dia, mes, anio } = formData.fecha_nacimiento;
    if (!dia || !mes || !anio) {
      toast.error("Completa tu fecha de nacimiento");
      return;
    }

    setStep(2);
  };

  const handleSubmitFinal = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Formatear fecha de nacimiento
      const { dia, mes, anio } = formData.fecha_nacimiento;
      const fecha_nacimiento = `${anio}-${mes.padStart(2, "0")}-${dia.padStart(
        2,
        "0"
      )}`;

      // Preparar datos de registro
      const registroData = {
        token_temporal: formData.token_temporal,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        password_confirm: formData.password_confirm,
        fecha_nacimiento,
        genero: formData.genero,
        buscando: formData.buscando,
        carrera: formData.carrera,
        semestre: parseInt(formData.semestre),
      };

      // Registrar usuario
      const result = await authService.registro(registroData);

      // Guardar auth
      setAuth(result.usuario, result.tokens);

      toast.success("¡Registro exitoso!");

      // Si hay fotos, navegar a subirlas, si no, al home
      if (fotos.length > 0) {
        navigate("/upload-photos", { state: { fotos } });
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Error registro:", error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.detail ||
          "Error al registrarse"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-8">
            <img
              src={logo}
              alt="CUCEI Match Logo"
              className="w-48 md:w-56 lg:w-64 object-contain"
            />
          </div>
          <p className="text-lg text-gray-700">
            Hola, <strong>{nombre}</strong>
          </p>
          <p className="text-sm text-gray-500">Vigencia: {vigencia}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div
            className={`flex items-center gap-2 ${
              step >= 1 ? "text-pink-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? "bg-pink-600 text-white" : "bg-gray-300"
              }`}
            >
              {step > 1 ? <Check size={16} /> : "1"}
            </div>
            <span className="hidden sm:inline">Datos básicos</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div
            className={`flex items-center gap-2 ${
              step >= 2 ? "text-pink-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? "bg-pink-600 text-white" : "bg-gray-300"
              }`}
            >
              2
            </div>
            <span className="hidden sm:inline">Fotos y preferencias</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {step === 1 ? (
            <form onSubmit={handleSubmitStep1} className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">{nombre}</h2>

              {/* Username/Alias */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alias (nombre de usuario)
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="ej: juan_dev"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="correo@alumnos.udg.mx"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none pr-12"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    name="password_confirm"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPasswordConfirm ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de nacimiento
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="number"
                    placeholder="DD"
                    value={formData.fecha_nacimiento.dia}
                    onChange={(e) =>
                      handleFechaNacimiento("dia", e.target.value)
                    }
                    min="1"
                    max="31"
                    className="px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
                    required
                  />
                  <input
                    type="number"
                    placeholder="MM"
                    value={formData.fecha_nacimiento.mes}
                    onChange={(e) =>
                      handleFechaNacimiento("mes", e.target.value)
                    }
                    min="1"
                    max="12"
                    className="px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
                    required
                  />
                  <input
                    type="number"
                    placeholder="AAAA"
                    value={formData.fecha_nacimiento.anio}
                    onChange={(e) =>
                      handleFechaNacimiento("anio", e.target.value)
                    }
                    min="1950"
                    max="2010"
                    className="px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Género */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Género
                </label>
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
                  required
                >
                  <option value="">Selecciona...</option>
                  <option value="hombre">Hombre</option>
                  <option value="mujer">Mujer</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              {/* Tengo interés en */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tengo interés en
                </label>
                <select
                  name="buscando"
                  value={formData.buscando}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
                  required
                >
                  <option value="">Selecciona...</option>
                  <option value="hombres">Hombres</option>
                  <option value="mujeres">Mujeres</option>
                  <option value="ambos">Ambos</option>
                </select>
              </div>

              {/* Carrera */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carrera
                </label>
                <input
                  type="text"
                  name="carrera"
                  value={formData.carrera}
                  onChange={handleChange}
                  placeholder="Ingeniería/Licenciatura en..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
                />
              </div>

              {/* Semestre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semestre
                </label>
                <input
                  type="number"
                  name="semestre"
                  value={formData.semestre}
                  onChange={handleChange}
                  min="1"
                  max="12"
                  placeholder="Ej. 6"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-purple-900 text-white rounded-xl font-semibold hover:bg-purple-800 transition"
              >
                Siguiente
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  ¿Ya tienes una cuenta? Inicia sesión aquí
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmitFinal} className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Fotos del perfil</h2>

              {/* Upload Photos */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {fotoPreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden bg-gray-100"
                  >
                    <img
                      src={preview}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-pink-500 text-white text-xs rounded">
                        Principal
                      </div>
                    )}
                  </div>
                ))}

                {fotos.length < 6 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 transition">
                    <Upload className="text-gray-400 mb-2" size={32} />
                    <span className="text-sm text-gray-500">Añadir foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                    />
                  </label>
                )}
              </div>

              <p className="text-sm text-gray-500 text-center">
                Mínimo 1 foto, máximo 6. La primera será tu foto principal.
              </p>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={loading || fotos.length === 0}
                  className="flex-1 py-4 bg-purple-900 text-white rounded-xl font-semibold hover:bg-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Registrando..." : "Finalizar registro"}
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleSubmitFinal({ preventDefault: () => {} })}
                className="w-full text-pink-600 hover:text-pink-700 text-sm"
              >
                Saltar por ahora (agregar fotos después)
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
