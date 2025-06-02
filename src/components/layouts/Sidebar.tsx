import { LogOut, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/authService";
import { useState } from "react";
import { FiUsers } from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import { TbFileDescription } from "react-icons/tb";

type SidebarProps = {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
};

const menuItems = [
  {
    key: "home",
    label: "Beranda",
    icon: <FaHome />,
  },
  {
    key: "user",
    label: "Pengguna",
    icon: <FiUsers />,
  },
  { key: "criteria", label: "Data Kriteria", icon: <TbFileDescription /> },
  {
    key: "alternatives",
    label: "Data Alternatif",
    icon: <TbFileDescription />,
  },
];

export default function Sidebar({ activeMenu, setActiveMenu }: SidebarProps) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const HandleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    AuthService.logout();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="w-48 h-full flex flex-col bg-white border-r border-gray-200 select-none">
      <div className="flex-1">
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`p-4 gap-4 cursor-pointer hover:bg-blue-50 border-b border-gray-200 flex items-center ${
              activeMenu === item.key
                ? "bg-blue-100 text-blue-600 font-medium hover:bg-blue-100"
                : "text-gray-700"
            }`}
            onClick={() => {
              setActiveMenu(item.key);
              navigate(`/dashboard/${item.key}`);
            }}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </div>

      <div
        className={`p-4 hover:bg-gray-200 border-t border-gray-200 cursor-pointer flex items-center gap-4 transition-colors duration-300 ${
          isLoggingOut
            ? "text-gray-400 cursor-wait"
            : "text-red-500 hover:text-red-600"
        }`}
        onClick={!isLoggingOut ? HandleLogout : undefined}
      >
        {isLoggingOut ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <LogOut size={16} />
        )}
        {isLoggingOut ? "Keluar..." : "Keluar"}
      </div>
    </div>
  );
}
