import { User } from "lucide-react";
import wbicon from "/src/assets/wb icon.png";
import AuthService from "../../api/authService";

export default function Header() {
  // const [searchTerm, setSearchTerm] = useState("");
  const user = AuthService.getUsername();
  return (
    <div className=" flex flex-row justify-between items-center bg-gray-200 border-b border-gray-200 px-8 py-3">
      <img
        src={wbicon}
        className="size-20 w-auto object-contain pointer-events-none select-none"
      ></img>
      <div className="relative ">
        <p className="text-black font-bold text-2xl text-center">
          SISTEM PENDUKUNG KEPUTUSAN <br />
        </p>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <p className="text-black">Hello {user}!</p>
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <User size={18} className="text-gray-700" />
        </div>
      </div>
    </div>
  );
}
