import API_BASE_URL, { API_ENDPOINTS } from "./config.js";

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

      const data = await response.json();

      if (!response.ok) {
        // Menggunakan format error yang dikirim oleh server
        throw {
          status: data.status || response.status,
          message: data.message || "Login gagal",
          error: data.error || true,
        };
      }

      // Simpan token ke localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
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
          message: data.message || "Register gagal",
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
      const token = AuthService.getToken(); // Ambil token jika ada autentikasi
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
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
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
      const response = await fetch(`${API_BASE_URL}/users/logout`, {
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

      // Tetap hapus token dari localStorage meskipun request gagal
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
    const user = AuthService.getCurrentUser();
    return user ? user.username : null;
  },
};

export default AuthService;
