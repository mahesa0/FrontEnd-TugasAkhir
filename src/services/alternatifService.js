import {
    API_ENDPOINTS_ALTERNATIF
} from "./config";
import AuthService from "./authService"; // Asumsi kita butuh token

const AlternatifService = {
    async getAllAlternatif() {
        try {
            const token = AuthService.getToken();
            if (!token) {
                throw new Error("Token not found. Please login.");
            }

            const response = await fetch(API_ENDPOINTS_ALTERNATIF.GET_ALL_ALTERNATIF, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include", // Pastikan cookie/token dikirim
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: response.statusText
                }));
                throw new Error(errorData.message || "Failed to fetch alternatives");
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error("Received non-JSON response:", text);
                throw new Error("Did not receive JSON response from server.");
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching alternatives:", error);
            throw error;
        }
    },

    async createAlternatif(data) {
        try {
            const token = AuthService.getToken();
            if (!token) {
                throw new Error("Token not found. Please login.");
            }

            const response = await fetch(API_ENDPOINTS_ALTERNATIF.CREATE_ALTERNATIF, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: response.statusText
                }));
                throw new Error(errorData.message || "Failed to create alternative");
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error("Received non-JSON response:", text);
                throw new Error("Did not receive JSON response from server.");
            }

            return await response.json();
        } catch (error) {
            console.error("Error creating alternative:", error);
            throw error;
        }
    },

    async updateAlternatifByKode(kodeJurusan, data) {
        try {
            const token = AuthService.getToken();
            if (!token) {
                throw new Error("Token not found. Please login.");
            }

            const endpoint = API_ENDPOINTS_ALTERNATIF.UPDATE_BY_KODE.replace(
                ":kodeJurusan",
                kodeJurusan
            );

            const response = await fetch(endpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: response.statusText
                }));
                throw new Error(errorData.message || "Failed to update alternative");
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error("Received non-JSON response:", text);
                throw new Error("Did not receive JSON response from server.");
            }

            return await response.json();
        } catch (error) {
            console.error("Error updating alternative:", error);
            throw error;
        }
    },

    async deleteAlternatifByKode(kodeJurusan) {
        try {
            const token = AuthService.getToken();
            if (!token) {
                throw new Error("Token not found. Please login.");
            }

            const endpoint = API_ENDPOINTS_ALTERNATIF.DELETE_BY_KODE.replace(
                ":kodeJurusan",
                kodeJurusan
            );

            const response = await fetch(endpoint, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: response.statusText
                }));
                throw new Error(errorData.message || "Failed to delete alternative");
            }

            // Delete typically doesn't return JSON, so we don't parse response body
            // We just check if response was ok
            return {
                message: "Alternative deleted successfully"
            };

        } catch (error) {
            console.error("Error deleting alternative:", error);
            throw error;
        }
    },
};

export default AlternatifService;