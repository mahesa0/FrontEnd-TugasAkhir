const API_BASE_URL =
  window.ipcRenderer?.env?.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL || // fallback ke .env lokal
  "http://localhost:8181"; // fallback default

//dev
export const API_ENDPOINTS = {
  LOGIN: `/users/login`,
  REGISTER: `/users/register`,
  GET_ALL_USERS: `/users/get/all`,
};

//prod
// export const API_ENDPOINTS = {
//   LOGIN: `${API_BASE_URL}/users/login`,
//   REGISTER: `${API_BASE_URL}/users/register`,
//   GET_ALL_USERS: `${API_BASE_URL}/users/get/all`,
// };

export default API_BASE_URL;
