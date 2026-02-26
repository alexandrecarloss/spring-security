import { jwtDecode } from "jwt-decode";

type Token = {
  scope: string;
  sub: string;
};

export function getUserData() {
  const token = localStorage.getItem("authToken");

  if (!token) return null;

  return jwtDecode<Token>(token);
}

export function isAdmin() {
  const data = getUserData();
  return data?.scope.includes("ADMIN");
}