import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Interceptor para adicionar o Token em cada requisição automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});