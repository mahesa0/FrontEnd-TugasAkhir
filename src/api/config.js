const API_BASE_URL =
  window.ipcRenderer?.env?.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL || // fallback ke .env lokal
  "http://localhost:8181"; // fallback default

//dev
export const API_ENDPOINTS = {
  LOGIN: `/users/login`,
  LOGOUT: `/users/logout`,
  REGISTER: `/users/register`,
  GET_ALL_USERS: `/users/get/all`,
  UPDATE_BY_ID: `/users/:id`,
  DELETE_BY_ID: `/users/:id`,
};

//prod
// export const API_ENDPOINTS = {
//   LOGIN: `${API_BASE_URL}/users/login`,
//   LOGOUT: `${API_BASE_URL}/users/logout`,
//   REGISTER: `${API_BASE_URL}/users/register`,
//   GET_ALL_USERS: `${API_BASE_URL}/users/get/all`,
//   UPDATE_BY_ID: `${API_BASE_URL}/users/:id`,
//   DELETE_BY_ID: `${API_BASE_URL}/users/:id`,
// };

export default API_BASE_URL;
