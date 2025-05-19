import { API_ENDPOINTS } from "./config.js";

// Service untuk menangani autentikasi
export const AuthService = {
  // Fungsi login
  login: async (username, password) => {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      // Periksa jika respons tidak berhasil (status code >= 400)
      if (!response.ok) {
        // Coba baca body sebagai JSON. Jika gagal (misal body kosong/bukan JSON),
        // gunakan pesan error default atau status code.
        let errorData = {};
        try {
          const contentType = response.headers.get("content-type");
          // Hanya coba parse JSON jika respons memiliki content-type JSON dan ada body
          if (
            contentType &&
            contentType.includes("application/json") &&
            parseInt(response.headers.get("content-length") || "0", 10) > 0
          ) {
            errorData = await response.json();
          } else {
            // Jika bukan JSON atau body kosong, gunakan status dan teks respons
            errorData.status = response.status;
            errorData.message = `Server error! Status: ${response.status}`;
            // Coba baca teks respons jika ada, untuk debugging
            try {
              const text = await response.text();
              if (text) errorData.responseText = text.substring(0, 200);
            } catch (e) {
              /* ignore */
            }
          }
        } catch (e) {
          // Jika parsing JSON gagal bahkan dengan header JSON, ini Unexpected end of JSON
          errorData.status = response.status;
          errorData.message = `Failed to parse error response as JSON: ${e.message}`;
        }

        // Buat objek error untuk dilempar
        throw {
          status: errorData.status || response.status,
          message:
            errorData.message || `Login gagal (Status: ${response.status})`,
          error: true,
          responseText: errorData.responseText, // Sertakan teks respons parsial jika ada
        };
      }

      // Jika respons berhasil (status code 2xx)
      const data = await response.json(); // Sekarang aman mengurai JSON karena response.ok true

      // Simpan token ke localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      // Pastikan token dan user dihapus di localStorage jika login gagal
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw error; // Lempar kembali error agar bisa ditangani di komponen yang memanggil
    }
  },

  // Fungsi register
  register: async (username, password, confPassword) => {
    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, confPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Menggunakan format error yang dikirim oleh server
        throw {
          status: data.status || response.status,
          message: data.message || "Gagal mendaftar",
          error: data.error || true,
        };
      }

      return data;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  //Fungsi untuk mengambil semua data (kecuali password)
  getAllUsers: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_ALL_USERS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AuthService.getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: data.status || response.status,
          message: data.message || "Gagal mengambil data pengguna",
          error: data.error || true,
        };
      }

      return data;
    } catch (error) {
      console.error("Get all users error:", error);
      throw error;
    }
  },

  //Fungsi untuk update user
  updateUserById: async (id, updatedData) => {
    try {
      const token = AuthService.getToken();

      if (!token) {
        throw {
          status: 401,
          message: "Token tidak ditemukan. Silakan login kembali.",
          error: true,
        };
      }

      const endpoint = API_ENDPOINTS.UPDATE_BY_ID.replace(":id", id);

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: data.status || response.status,
          message: data.message || "Gagal memperbarui user",
          error: true,
        };
      }

      return data;
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  },

  //Fungsi untuk delete user
  deleteUserById: async (id) => {
    try {
      const token = AuthService.getToken();
      const response = await fetch(
        API_ENDPOINTS.DELETE_BY_ID.replace(":id", id),
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: data.status || response.status,
          message: data.message || "Gagal menghapus user",
          error: true,
        };
      }

      return data;
    } catch (error) {
      console.error("Delete user error:", error);
      throw error;
    }
  },

  // Fungsi logout
  logout: async () => {
    try {
      const token = AuthService.getToken();

      // Panggil endpoint logout di backend
      const response = await fetch(API_ENDPOINTS.LOGOUT, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        // Dengan credentials untuk memungkinkan server menghapus cookie
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: data.status || response.status,
          message: data.message || "Gagal Keluar",
          error: true,
        };
      }

      // Hapus data dari localStorage setelah logout berhasil di server
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Hapus cookie token di sisi client juga (untuk berjaga-jaga)
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      return data;
    } catch (error) {
      console.error("Logout error:", error);

      // Pastikan token dan user dihapus di localStorage meskipun request gagal
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Hapus cookie token di sisi client juga (untuk berjaga-jaga)
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      throw error;
    }
  },

  // Fungsi untuk mendapatkan token
  getToken: () => {
    return localStorage.getItem("token");
  },

  // Fungsi untuk cek status login
  isLoggedIn: () => {
    return !!localStorage.getItem("token");
  },

  // Fungsi untuk mendapatkan user
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  // Funsi untuk mendapatkan username
  getUsername: () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    return user ? user.username : null;
  },
};

export default AuthService;
