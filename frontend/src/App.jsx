import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./hooks/useAuth"; // Importamos el nuevo hook

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import ValidateQR from "./pages/ValidateQR";
import Register from "./pages/Register";
import Home from "./pages/Home";

// Componente para rutas protegidas
import ProtectedRoute from "./components/ProtectedRoute";

// Componente para manejar redirección si ya está logueado
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/home" /> : children;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
        }}
      />

      <Routes>
        {/* Rutas Públicas */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/validate-qr" element={<ValidateQR />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas Privadas */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Agrega aquí otras rutas privadas que necesites */}
        {/*
        <Route path="/swipe" element={<ProtectedRoute><Swipe /></ProtectedRoute>} />
        <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
        <Route path="/chat/:matchId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> 
        */}

        {/* Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
