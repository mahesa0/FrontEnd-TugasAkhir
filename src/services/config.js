const API_BASE_URL =
  window.ipcRenderer?.env?.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL || // fallback ke .env lokal
  "http://localhost:8181"; // fallback default

//user dev
export const API_ENDPOINTS_USERS = {
  LOGIN: `${API_BASE_URL}/users/login`,
  LOGOUT: `${API_BASE_URL}/users/logout`,
  REGISTER: `${API_BASE_URL}/users/register`,
  GET_ALL_USERS: `${API_BASE_URL}/users/get/all`,
  UPDATE_BY_ID: `${API_BASE_URL}/users/:id`,
  DELETE_BY_ID: `${API_BASE_URL}/users/:id`,
};

//kriteria dev
export const API_ENDPOINTS_CRITERIA = {
  CREATE_KRITERIA: `${API_BASE_URL}/kriteria/`,
  GET_BY_ID: `${API_BASE_URL}/kriteria/:id`,
  GET_ALL_KRITERIA: `${API_BASE_URL}/kriteria/`,
  UPDATE_BY_ID: `${API_BASE_URL}/kriteria/:id`,
  DELETE_BY_ID: `${API_BASE_URL}/kriteria/:id`,
};

//alternatif dev
export const API_ENDPOINTS_ALTERNATIF = {
  CREATE_ALTERNATIF: `${API_BASE_URL}/alternatif/`,
  GET_BY_KODE: `${API_BASE_URL}/alternatif/:kodeJurusan`,
  GET_ALL_ALTERNATIF: `${API_BASE_URL}/alternatif/`,
  UPDATE_BY_KODE: `${API_BASE_URL}/alternatif/:kodeJurusan`,
  DELETE_BY_KODE: `${API_BASE_URL}/alternatif/:kodeJurusan`,
};

//user prod
// export const API_ENDPOINTS_USERS = {
//   LOGIN: `${API_BASE_URL}/users/login`,
//   LOGOUT: `${API_BASE_URL}/users/logout`,
//   REGISTER: `${API_BASE_URL}/users/register`,
//   GET_ALL_USERS: `${API_BASE_URL}/users/get/all`,
//   UPDATE_BY_ID: `${API_BASE_URL}/users/:id`,
//   DELETE_BY_ID: `${API_BASE_URL}/users/:id`,
// };

export default API_BASE_URL;