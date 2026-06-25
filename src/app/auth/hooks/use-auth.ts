import { AUTH_STORAGE_KEY } from "./auth.constants";

export const useAuth = () => {
  const isAuthenticated = Boolean(localStorage.getItem(AUTH_STORAGE_KEY));
  return { isAuthenticated };
};