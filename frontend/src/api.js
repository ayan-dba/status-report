import axios from "axios";

const api = axios.create({ baseURL: "/api" });

// Attach token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dba_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("dba_token");
      localStorage.removeItem("dba_admin");
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

export default api;
