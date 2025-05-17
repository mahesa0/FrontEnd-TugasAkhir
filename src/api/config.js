const API_BASE_URL = window.ipcRenderer?.env?.API_BASE_URL;

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/users/login`,
  REGISTER: `${API_BASE_URL}/users/register`,
  GET_ALL_USERS: `${API_BASE_URL}/users/get/all`,
};

export default API_BASE_URL;
