// layouts/MainLayout.tsx
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../user/Sidebar";
import Header from "../../user/Header";

export default function HomeLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<string>("Page");

  // Sinkronkan activeDashboard dengan URL saat mount atau URL berubah
  useEffect(() => {
    const segments = location.pathname.split("/");
    const page = segments[2] || "page";
    setActivePage(page);
  }, [location.pathname]);

  // Dipanggil oleh Sidebar untuk navigasi
  const handleSetMenu = (page: string) => {
    setActivePage(page);
    navigate(`/home/${page}`);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden h-screen w-screen">
      {/* Header */}
      <Header />
      <div className="flex overflow-hidden h-screen">
        {/* Sidebar: menerima prop activeDashboard & setter */}
        <Sidebar activeMenu={activePage} setActiveMenu={handleSetMenu} />

        {/* Konten halaman child akan dirender di sini */}
        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
