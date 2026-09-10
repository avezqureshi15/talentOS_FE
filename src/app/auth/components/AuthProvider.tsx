import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import httpClient, { publicClient } from "@/services/http-client";
import { AuthContext, type User } from "@/app/auth/components/auth-context";
import {
  AUTH_STORAGE_KEY,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "@/app/auth/hooks/auth.constants";
import { storage } from "@/utils/storage";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

const getAccessToken = () => storage.get(ACCESS_TOKEN_KEY);

const clearSession = () => {
  storage.remove(ACCESS_TOKEN_KEY);
  storage.remove(REFRESH_TOKEN_KEY);
  storage.remove(AUTH_STORAGE_KEY);
};

const storeAuth = (access: string, refresh: string, u: User) => {
  storage.set(ACCESS_TOKEN_KEY, access);
  storage.set(REFRESH_TOKEN_KEY, refresh);
  storage.set(AUTH_STORAGE_KEY, JSON.stringify(u));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const restored = useRef(false);

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;

    const restore = async () => {
      const storedUser = storage.get(AUTH_STORAGE_KEY);
      const storedAccess = storage.get(ACCESS_TOKEN_KEY);

      if (!storedUser || !storedAccess) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await httpClient.get<{ user: User }>(API_ENDPOINTS.AUTH_ME);
        setUser(data.user);
      } catch {
        const storedRefresh = storage.get(REFRESH_TOKEN_KEY);
        if (!storedRefresh) {
          clearSession();
          setIsLoading(false);
          return;
        }
        try {
          const { data: refreshData } = await httpClient.post<{ access_token: string }>(
            API_ENDPOINTS.AUTH_REFRESH,
            { refresh_token: storedRefresh },
          );
          storage.set(ACCESS_TOKEN_KEY, refreshData.access_token);
          const { data: meData } = await httpClient.get<{ user: User }>(API_ENDPOINTS.AUTH_ME);
          setUser(meData.user);
        } catch {
          clearSession();
        }
      }
      setIsLoading(false);
    };

    restore();
  }, []);

  const login = useCallback(async (credential: string) => {
    const { data } = await publicClient.post<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
    }>(API_ENDPOINTS.AUTH_GOOGLE, { credential });

    storage.set(ACCESS_TOKEN_KEY, data.access_token);

    const { data: meData } = await httpClient.get<{ user: User }>(API_ENDPOINTS.AUTH_ME);

    storeAuth(data.access_token, data.refresh_token, meData.user);
    setUser(meData.user);
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    const { data } = await publicClient.post<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
    }>(API_ENDPOINTS.AUTH_LOGIN, { email, password });

    storage.set(ACCESS_TOKEN_KEY, data.access_token);

    const { data: meData } = await httpClient.get<{ user: User }>(API_ENDPOINTS.AUTH_ME);

    storeAuth(data.access_token, data.refresh_token, meData.user);
    setUser(meData.user);
  }, []);

  const logout = useCallback(async () => {
    const refresh = storage.get(REFRESH_TOKEN_KEY);
    try {
      if (refresh) await httpClient.post(API_ENDPOINTS.AUTH_LOGOUT, { refresh_token: refresh });
    } catch { /* ignore */ }
    clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithEmail, logout, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
