import { api } from "../services/api";

export const loginRequest = async (email: string, password: string) => {
  const response = await api.post("/login", { email, password });
  return response.data;
};

export const registerRequest = async (
  fullName: string,
  email: string,
  password: string,
  file?: File
) => {
  const formData = new FormData();
  const data = JSON.stringify({ fullName, email, password });
  formData.append("data", data);
  
  if (file) {
    formData.append("file", file);
  }

  const response = await api.post("/users", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
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

export const uploadProfilePicture = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`/users/${userId}/upload-foto`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getGoogleAuthUrl = () => "http://localhost:8080/oauth2/authorization/google";