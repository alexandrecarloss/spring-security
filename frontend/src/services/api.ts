import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.0.103:8080",
});

const publicRoutes = [
  "/login", 
  "/users", 
  "/auth/forgot-password", 
  "/auth/reset-password"
];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  const isPublicRoute = publicRoutes.some(route => config.url?.startsWith(route));

  if (token && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});