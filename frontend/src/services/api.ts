import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // Altere para a porta do seu backend
});

// Adiciona o token do Firebase em cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("fb_id_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
