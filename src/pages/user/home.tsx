import AuthService from "../../api/authService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const HandleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    AuthService.logout();
    navigate("/auth", { replace: true });
  };
  return (
    <div className="text-black text-center w-screen h-screen bg-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Home</h2>
      <p>Halaman home untuk user</p>
      <button
        onClick={!isLoggingOut ? HandleLogout : undefined}
        className="p-2 mt-6 bg-red-500 rounded-full"
      >
        logout
      </button>
    </div>
  );
}
