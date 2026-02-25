import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Interceptor para adicionar o Token em cada requisição automaticamente
const publicRoutes = ["/login", "/users"];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token && !publicRoutes.includes(config.url!)) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});