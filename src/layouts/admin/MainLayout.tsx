// layouts/MainLayout.tsx
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeDashboard, setActiveDashboard] = useState<string>("dashboard");

  // Sinkronkan activeDashboard dengan URL saat mount atau URL berubah
  useEffect(() => {
    // URL: /home/:menu
    const segments = location.pathname.split("/");
    const dashboard = segments[2] || "dashboard";
    setActiveDashboard(dashboard);
  }, [location.pathname]);

  // Dipanggil oleh Sidebar untuk navigasi
  const handleSetMenu = (dashboard: string) => {
    setActiveDashboard(dashboard);
    navigate(`/dashboard/${dashboard}`);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden h-screen w-screen">
      {/* Header */}
      <Header />
      <div className="flex overflow-hidden h-screen">
        {/* Sidebar: menerima prop activeDashboard & setter */}
        <Sidebar activeMenu={activeDashboard} setActiveMenu={handleSetMenu} />

        {/* Konten halaman child akan dirender di sini */}
        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
