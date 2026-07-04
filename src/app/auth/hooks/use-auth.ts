import { STORAGE_KEYS } from "@/constants/constants";
import { storage } from "@/utils/storage";

export const useAuth = () => {
  const isAuthenticated = Boolean(storage.get(STORAGE_KEYS.AUTH_TOKEN));
  return { isAuthenticated };
};