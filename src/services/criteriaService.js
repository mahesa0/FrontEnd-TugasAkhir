import {
    API_ENDPOINTS_CRITERIA
} from "./config.js";
import AuthService from "./authService.js";

export const CriteriaService = {
    // Fungsi untuk membuat kriteria baru
    createCriteria: async (criteriaData) => {
        try {
            const token = AuthService.getToken();
            if (!token) {
                throw {
                    status: 401,
                    message: "Token tidak ditemukan. Silakan login kembali.",
                    error: true,
                };
            }

            const response = await fetch(API_ENDPOINTS_CRITERIA.CREATE_KRITERIA, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(criteriaData),
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    throw {
                        status: data.status || response.status,
                        message: data.message || "Gagal membuat kriteria",
                        error: true,
                    };
                } else {
                    throw {
                        status: response.status,
                        message: "Gagal membuat kriteria",
                        error: true,
                    };
                }
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Create criteria error:", error);
            throw error;
        }
    },

    // Fungsi untuk mendapatkan semua kriteria
    getAllCriteria: async () => {
        try {
            const token = AuthService.getToken();
            if (!token) {
                throw {
                    status: 401,
                    message: "Token tidak ditemukan. Silakan login kembali.",
                    error: true,
                };
            }

            const response = await fetch(API_ENDPOINTS_CRITERIA.GET_ALL_KRITERIA, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    throw {
                        status: data.status || response.status,
                        message: data.message || "Gagal mengambil data kriteria",
                        error: true,
                    };
                } else {
                    throw {
                        status: response.status,
                        message: "Gagal mengambil data kriteria",
                        error: true,
                    };
                }
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Get all criteria error:", error);
            throw error;
        }
    },

    // Fungsi untuk mendapatkan kriteria berdasarkan ID
    getCriteriaById: async (id) => {
        try {
            const token = AuthService.getToken();
            if (!token) {
                throw {
                    status: 401,
                    message: "Token tidak ditemukan. Silakan login kembali.",
                    error: true,
                };
            }

            const endpoint = API_ENDPOINTS_CRITERIA.GET_BY_ID.replace(":id", id);
            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    throw {
                        status: data.status || response.status,
                        message: data.message || "Gagal mengambil data kriteria",
                        error: true,
                    };
                } else {
                    throw {
                        status: response.status,
                        message: "Gagal mengambil data kriteria",
                        error: true,
                    };
                }
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Get criteria by ID error:", error);
            throw error;
        }
    },

    // Fungsi untuk memperbarui kriteria
    updateCriteria: async (id, updatedData) => {
        try {
            const token = AuthService.getToken();
            if (!token) {
                throw {
                    status: 401,
                    message: "Token tidak ditemukan. Silakan login kembali.",
                    error: true,
                };
            }

            const endpoint = API_ENDPOINTS_CRITERIA.UPDATE_BY_ID.replace(":id", id);
            const response = await fetch(endpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    throw {
                        status: data.status || response.status,
                        message: data.message || "Gagal memperbarui kriteria",
                        error: true,
                    };
                } else {
                    throw {
                        status: response.status,
                        message: "Gagal memperbarui kriteria",
                        error: true,
                    };
                }
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Update criteria error:", error);
            throw error;
        }
    },

    // Fungsi untuk menghapus kriteria
    deleteCriteria: async (id) => {
        try {
            const token = AuthService.getToken();
            if (!token) {
                throw {
                    status: 401,
                    message: "Token tidak ditemukan. Silakan login kembali.",
                    error: true,
                };
            }

            const endpoint = API_ENDPOINTS_CRITERIA.DELETE_BY_ID.replace(":id", id);
            const response = await fetch(endpoint, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    throw {
                        status: data.status || response.status,
                        message: data.message || "Gagal menghapus kriteria",
                        error: true,
                    };
                } else {
                    throw {
                        status: response.status,
                        message: "Gagal menghapus kriteria",
                        error: true,
                    };
                }
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Delete criteria error:", error);
            throw error;
        }
    },
};