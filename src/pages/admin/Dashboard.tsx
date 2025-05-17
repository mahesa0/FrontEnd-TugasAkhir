import { useEffect, useState } from "react";
import { FaPen, FaTrash, FaTimes } from "react-icons/fa";
import "react-icons";
import AuthService from "../../api/authService";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  interface User {
    _id: string;
    username: string;
    role: string;
    createdAt: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setUsername(user.username);
    setRole(user.role);
    setPassword("");
  };

  const handleSave = async () => {
    if (!editingUser) return;

    if (!username.trim() || !role.trim()) {
      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        width: "47vh",
        confirmButtonColor: "#3B82F6",
        text: "Nama pengguna tidak boleh kosong",
        showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
      });
      return;
    }

    try {
      const response = await AuthService.updateUserById(editingUser._id, {
        username,
        role,
        password,
      });

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text:
          response.data.message ||
          `Pengguna berhasil diperbarui${
            password ? " dengan kata sandi baru" : ""
          }`,
        timer: 1300,
        showConfirmButton: false,
        showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
      });

      const usersResponse = await AuthService.getAllUsers();
      if (usersResponse?.data) {
        setUsers(usersResponse.data);
      }

      setEditingUser(null);
    } catch (error) {
      console.error("Gagal memperbarui pengguna:", error);

      let errorMessage = "Gagal memperbarui pengguna";

      if (error && typeof error === "object") {
        if ("response" in error) {
          const apiError = error as {
            response?: {
              data?: {
                message?: string;
                errors?: Array<{ msg?: string }>;
              };
            };
          };

          if (apiError.response?.data?.message) {
            errorMessage = apiError.response.data.message;
          } else if (apiError.response?.data?.errors?.length) {
            errorMessage = apiError.response.data.errors
              .map((e) => e.msg || "Validasi gagal")
              .join(", ");
          }
        } else if ("message" in error && typeof error.message === "string") {
          errorMessage = error.message;
        }
      }

      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        width: "53vh",
        text: errorMessage,
        confirmButtonColor: "#3B82F6",
        showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
      });
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Data pengguna akan dihapus secara permanen!",
      icon: "warning",
      width: "59vh",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
    });

    if (result.isConfirmed) {
      try {
        await AuthService.deleteUserById(id);

        await Swal.fire({
          title: "Terhapus!",
          text: "Pengguna berhasil dihapus.",
          icon: "success",
          timer: 1300,
          showConfirmButton: false,
          showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
        });

        const response = await AuthService.getAllUsers();
        if (response && response.data) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error("Gagal menghapus user:", error);
        Swal.fire({
          title: "Gagal!",
          text: "Gagal menghapus user. Silakan coba lagi.",
          icon: "error",
          showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
        });
      }
    }
  };

  useEffect(() => {
    AuthService.getAllUsers()
      .then((response) => {
        if (response && response.data) {
          setUsers(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Gagal memuat data pengguna. Silakan refresh halaman.");
      });
  }, []);

  return (
    <div className="p-4 text-gray-700">
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl">Tabel Pengguna</span>
        <div className="relative w-full sm:w-1/3 flex items-center">
          <input
            type="text"
            placeholder="Cari nama pengguna..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow"
          />
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-2 text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={16} />
          </button>
        </div>
        <span className="">
          Total Pengguna:{" "}
          <span className="border-2 border-gray-500 p-1 rounded-sm">
            {users.length}
          </span>
        </span>
      </div>
      <table className="w-full ">
        <thead className="bg-gray-100">
          <tr className="border border-gray-300 text-center">
            <th className="p-2 border-r border-gray-300">Nama pengguna</th>
            <th className="p-2 border-r border-gray-300 ">Role</th>
            <th className="p-2 border-r border-gray-300">Dibuat pada</th>
            <th className="p-2 border-r border-gray-300">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.filter((user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
          ).length > 0 ? (
            users
              .slice()
              .filter((user) =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user) => (
                <tr
                  key={user._id}
                  className="border border-gray-300 text-center"
                >
                  <td className="p-2 border-r border-gray-300">
                    {user.username}
                  </td>
                  <td className="p-2 border-r border-gray-300">{user.role}</td>
                  <td className="p-2 border-r border-gray-300">
                    {new Date(user.createdAt).toLocaleString("en-US", {
                      hour12: false,
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="flex p-2 gap-3 flex-row justify-center text-white text-sm">
                    <button
                      onClick={() => handleEdit(user)}
                      className=" bg-sky-500 hover:bg-sky-700 rounded p-2 flex items-center justify-center gap-1"
                    >
                      <FaPen size="15" />
                      Sunting
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 hover:bg-red-800  rounded p-2 flex items-center justify-center gap-1"
                    >
                      <FaTrash size="14" />
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
          ) : (
            <tr className="border border-gray-300 text-center">
              <td className="p-2" colSpan={4}>
                Tidak ada data pengguna
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* pop up edit */}
      <AnimatePresence>
        {editingUser && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl font-bold mb-4">Edit Pengguna</h2>

              {/* Feedback message - now only inside modal */}

              <label className="block mb-2">
                Nama pengguna:
                <input
                  className="w-full border rounded-sm p-2 mt-1"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              <label className="block mb-2">
                Role:
                <select
                  className="w-full border rounded-sm p-2 mt-1"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option className="text-lg" value="Admin">
                    Admin
                  </option>
                  <option className="text-lg" value="User">
                    User
                  </option>
                </select>
              </label>
              <label className="block mb-2">
                Kata sandi baru (optional):
                <input
                  type="password"
                  className="w-full border rounded-sm p-2 mt-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Simpan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
