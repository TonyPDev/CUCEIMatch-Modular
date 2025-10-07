import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./stores/authStore";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import ValidateQR from "./pages/ValidateQR";
import Register from "./pages/Register";
// Futuros import
import Home from './pages/Home';
// import Swipe from './pages/Swipe';
// import Matches from './pages/Matches';
// import Chat from './pages/Chat';
// import Profile from './pages/Profile';

function PrivateRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/validate-qr" element={<ValidateQR />} />
        <Route path="/register" element={<Register />} />

        {/* Private routes*/}
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        {/*
        <Route path="/swipe" element={<PrivateRoute><Swipe /></PrivateRoute>} />
        <Route path="/matches" element={<PrivateRoute><Matches /></PrivateRoute>} />
        <Route path="/chat/:matchId" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} /> */}

        {/* Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
