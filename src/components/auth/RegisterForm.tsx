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

const RegisterForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfPasswordVisible, setIsConfPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const validateForm = () => {
      if (!username) return "Nama pengguna belum diisi";
      if (!password) return "Kata sandi belum diisi";
      if (!confPassword) return "Konfirmasi kata sandi belum diisi";
      if (password !== confPassword)
        return "Password dan konfirmasi harus sama";
      return null;
    };

    try {
      // Validasi form
      const error = validateForm();
      if (error) {
        Swal.fire({ icon: "warning", title: "Peringatan", text: error });
        setIsLoading(false);
        return;
      }

      // set time out untuk login
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (password !== confPassword) {
        Swal.fire({
          icon: "error",
          width: "58vh",
          title: "Password tidak cocok",
          confirmButtonColor: "#3B82F6",
          text: "Password dan konfirmasi password harus sama",
        });
        setIsLoading(false);
        return;
      }

      await AuthService.register(username, password, confPassword);

      Swal.fire({
        icon: "success",
        title: "Berhasil Mendaftar",
        width: "67vh",
        showClass: {
          backdrop: "backdrop-blur-sm bg-black/50",
        },
        text: "Akun berhasil dibuat. Mengarahkan ke halaman login...",
        timer: 2000,
        showConfirmButton: false,
      });

      // Redirect ke halaman login setelah beberapa detik
      setTimeout(() => {
        onSwitch();
      }, 1500);
    } catch (error) {
      // Menangani response error dari backend
      console.error("Register error:", error);
      let errorMessage = "Register gagal. Silakan coba lagi.";

      // Ekstrak pesan error dari response backend
      if (error && typeof error === "object" && "message" in error) {
        errorMessage =
          (error as { message?: string }).message || "Register gagal";
      }

      // Tampilkan popup error
      Swal.fire({
        icon: "error",
        width: "47vh",
        title: "Gagal Mendaftar",
        confirmButtonColor: "#3B82F6",
        showClass: {
          backdrop: "backdrop-blur-sm bg-black/50",
        },
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center">
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="w-[300px] p-[20px] rounded-[8px] shadow-me bg-card"
          >
            <div className="flex-col justify-center flex items-center pb-2 gap-2">
              <img
                src={wbicon}
                className="h-32 pl-3 w-auto max-w-[100%] object-contain pointer-events-none select-none"
                draggable="false"
              />
              <p className="select-none">Buat akun</p>
            </div>

            <div className="flex items-center mb-[15px] border-b border-usn">
              <FaUser className="mr-[10px]" />
              <input
                type="text"
                id="username"
                placeholder="Nama pengguna"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-[8px] border-none outline-none text-[16px]"
              />
            </div>

            <div className="flex items-center mb-[15px] border-b">
              <FaLock className="mr-[10px]" />
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                placeholder="Kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-[8px] border-none outline-none text-[16px]"
              />
              <span
                onMouseDown={() => setIsPasswordVisible(true)}
                onMouseUp={() => setIsPasswordVisible(false)}
                onMouseLeave={() => setIsPasswordVisible(false)}
                className="cursor-pointer text-xl select-none"
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="flex items-center mb-[20px] border-b">
              <FaLock className="mr-[10px]" />
              <input
                type={isConfPasswordVisible ? "text" : "password"}
                placeholder="Konfirmasi kata sandi"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
                className="w-full p-[8px] border-none outline-none text-[16px]"
              />
              <span
                onMouseDown={() => setIsConfPasswordVisible(true)}
                onMouseUp={() => setIsConfPasswordVisible(false)}
                onMouseLeave={() => setIsConfPasswordVisible(false)}
                className="cursor-pointer text-xl select-none"
              >
                {isConfPasswordVisible ? <FaEyeSlash /> : <FaEye />}
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
                  Mendaftar...
                </>
              ) : (
                "Daftar"
              )}
            </button>

            <p className="text-center mt-5 select-none">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="text-blue-bold"
                onClick={(e) => {
                  e.preventDefault();
                  onSwitch();
                }}
              >
                Masuk
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default RegisterForm;
