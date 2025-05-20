import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AuthFlipCard from "./components/auth/AuthFlipCard";
import { useEffect, useState } from "react";
import MainLayout from "./components/layouts/admin/MainLayout";
import Dashboard from "./pages/admin/Dashboard";
import History from "./pages/admin/Riwayat";
import Report from "./pages/admin/Report";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomeLayout from "./components/layouts/user/HomeLayout";
import Home from "./pages/user/Home";
import Perhitungan from "./pages/user/Perhitungan";
import Kriteria from "./pages/user/Kriteria";

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
          <Route index element={<Navigate to="user" replace />} />
          <Route path="/dashboard/user" element={<Dashboard />} />
          <Route path="/dashboard/history" element={<History />} />
          <Route path="/dashboard/report" element={<Report />} />
        </Route>

        <Route
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <HomeLayout />
            </ProtectedRoute>
          }
        >
          {/* Default redirect ke home */}
          <Route index element={<Navigate to="home" replace />} />
          <Route path="/home/home" element={<Home />} />
          <Route path="/home/perhitungan" element={<Perhitungan />} />
          <Route path="/home/kriteria" element={<Kriteria />} />
        </Route>
        {/* Fallback untuk rute tidak valid */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
