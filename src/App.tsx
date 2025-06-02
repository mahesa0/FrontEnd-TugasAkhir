import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AuthFlipCard from "./components/auth/AuthFlipCard";
import { useEffect, useState } from "react";
import MainLayout from "./components/layouts/MainLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Criteria from "./pages/Criteria";
import Alternatives from "./pages/Alternatives";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = localStorage.getItem("user");
    return !!user;
  });

  // Cek status login saat komponen mount
  useEffect(() => {
    // Cek ulang jika localStorage berubah saat runtime (misalnya logout)
    const handleStorageChange = () => {
      const user = localStorage.getItem("user");
      setIsAuthenticated(!!user);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* Rute Auth dengan Flip Card Animation */}
        <Route
          path="/auth"
          element={
            <AuthFlipCard onLoginSuccess={() => setIsAuthenticated(true)} />
          }
        />

        {/* Halaman yang diproteksi */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Default redirect ke dashboard */}
          <Route index element={<Navigate to="home" replace />} />
          <Route path="/dashboard/home" element={<Home />} />
          <Route path="/dashboard/user" element={<Dashboard />} />
          <Route path="/dashboard/criteria" element={<Criteria />} />
          <Route path="/dashboard/alternatives" element={<Alternatives />} />
        </Route>

        {/* Fallback untuk rute tidak valid */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
