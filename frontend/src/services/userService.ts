import { jwtDecode } from "jwt-decode";
import { api } from "./api";

export type TokenPayload = {
  scope: string;
  sub: string; 
  fullName?: string;
  picture?: string;
  email?: string;
};

export const updateProfileRequest = async (userId: string, fullName: string, file?: File) => {
    const formData = new FormData();
    const data = JSON.stringify({ fullName });
    formData.append("data", data);
    if (file) {
      formData.append("file", file);
    }
    const response = await api.put(`/users/${userId}`, formData, { 
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  };

export const userService = {
  getUserData: (): TokenPayload | null => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    try {
      return jwtDecode<TokenPayload>(token);
    } catch {
      return null;
    }
  },

  getAvatarUrl: (url?: string): string => {
    if (!url) return "/default-avatar.png";
    if (url.startsWith("http")) return url;
    const baseUrl = api.defaults.baseURL;
    const cleanBaseUrl = baseUrl?.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const finalUrl = `${cleanBaseUrl}/file/${url}`;
    // console.log(`Avatar url: ${finalUrl}`);
    
    return finalUrl;
  },

  logout: (navigate: (path: string) => void) => {
    localStorage.removeItem("authToken");
    navigate("/login");
  }
};