import { api } from "../services/api";

export const loginRequest = async (email: string, password: string) => {
  const response = await api.post("/login", { email, password });
  return response.data;
};

export const registerRequest = async (
  fullName: string,
  email: string,
  password: string
) => {
  const response = await api.post("/users", { fullName, email, password });
  return response.data;
};

export const forgotPasswordRequest = async (email: string) => {
  return api.post("/auth/forgot-password", 
    { email }, 
    { 
      headers: { 
        Authorization: undefined 
      } 
    }
  );
};

export const resetPasswordRequest = async (token: string, newPassword: string) => {
  const response = await api.post(`/auth/reset-password`, { token, newPassword });
  return response.data;
};