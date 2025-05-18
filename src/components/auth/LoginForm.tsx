import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./style.css";
import wbicon from "/src/assets/wb icon.png";
import AnimatedPage from "../AnimatedPage";
import AuthService from "../../api/authService";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

const LoginForm = ({
  onSwitch,
  onLoginSuccess,
}: {
  onSwitch: () => void;
  onLoginSuccess: (role: string) => void;
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!username) {
        Swal.fire({
          icon: "warning",
          width: "40vh",
          title: "Peringatan",
          confirmButtonColor: "#3B82F6",
          text: "Nama pengguna belum diisi",
          showClass: {
            backdrop: "backdrop-blur-sm bg-black/40",
          },
        });
        setIsLoading(false);
        return;
      }

      if (!password) {
        Swal.fire({
          icon: "warning",
          width: "40vh",
          title: "Peringatan",
          confirmButtonColor: "#3B82F6",
          text: "Kata sandi belum diisi",
          showClass: {
            backdrop: "backdrop-blur-sm bg-black/40",
          },
        });
        setIsLoading(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 200));

      // Kirim request login dan dapatkan data user
      const response = await AuthService.login(username, password);
      // Ambil role dari response
      const userRole = response?.user?.role;

      if (userRole === "Admin" || userRole === "User") {
        onLoginSuccess(userRole); // lempar role ke parent
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Masuk",
          confirmButtonColor: "#3B82F6",
          text: "Role pengguna tidak valid",
          showClass: { backdrop: "backdrop-blur-sm bg-black/40" },
        });
      }
    } catch (error) {
      console.error("Masuk error:", error);
      let errorMessage = "Masuk gagal. Silakan coba lagi.";

      if (error && typeof error === "object" && "message" in error) {
        errorMessage = (error as { message?: string }).message || "Login gagal";
      }

      Swal.fire({
        icon: "error",
        title: "Gagal Masuk",
        width: "40vh",
        confirmButtonColor: "#3B82F6",
        text: errorMessage,
        showClass: {
          backdrop: "backdrop-blur-sm bg-black/40",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="w-[300px] p-[20px] rounded-[8px] shadow-me bg-card"
        >
          <div className="flex-col justify-center flex items-center pb-2 gap-2 ">
            <img
              src={wbicon}
              className="h-32 pl-3 w-auto max-w-[100%] object-contain pointer-events-none select-none"
              draggable="false"
            ></img>
            <p className="select-none">Selamat datang !</p>
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
                {error}
              </div>
            )}
          </div>

          <div
            style={{
              borderBottom: "1px solid #ddd",
            }}
            className="flex items-center mb-[15px]"
          >
            <FaUser className="mr-[10px]" />
            <input
              type="text"
              id="username"
              placeholder="Nama pengguna"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-[100%] p-[8px] border-none outline-none text-[16px]"
              disabled={isLoading}
            />
          </div>

          <div
            style={{
              borderBottom: "1px solid #ddd",
            }}
            className="flex items-center mb-[20px]"
          >
            <FaLock className="mr-[10px]" />
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              placeholder="Kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-[100%] p-[8px] border-none outline-none text-[16px]"
              disabled={isLoading}
            />
            <span
              onMouseDown={() => setIsPasswordVisible(true)}
              onMouseUp={() => setIsPasswordVisible(false)}
              onMouseLeave={() => setIsPasswordVisible(false)}
              className="cursor-pointer text-xl"
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center gap-2 bg-[#0f4c75b9] hover:bg-[#0f4c75] text-white font-medium py-2 rounded-md transition-colors duration-300 ${
              isLoading ? "cursor-wait opacity-80" : ""
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Masuk...
              </>
            ) : (
              "Masuk"
            )}
          </button>

          <p className="text-center mt-5 select-none">
            Tidak punya akun?{" "}
            <Link
              to="/register"
              className="text-blue-bold"
              onClick={(e) => {
                e.preventDefault();
                onSwitch();
              }}
            >
              Daftar
            </Link>
          </p>
        </form>
      </div>
    </AnimatedPage>
  );
};

export default LoginForm;
