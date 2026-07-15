import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import httpClient from "@/services/http-client";
import { AuthContext, type User } from "@/app/auth/components/auth-context";
import {
  AUTH_STORAGE_KEY,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "@/app/auth/hooks/auth.constants";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

const clearSession = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const restored = useRef(false);

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;

    const restore = async () => {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      const storedAccess = localStorage.getItem(ACCESS_TOKEN_KEY);

      if (!storedUser || !storedAccess) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await httpClient.get<{ user: User }>(API_ENDPOINTS.AUTH_ME, {
          headers: { Authorization: `Bearer ${storedAccess}` },
        });
        setUser(data.user);
      } catch {
        const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);
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
          localStorage.setItem(ACCESS_TOKEN_KEY, refreshData.access_token);
          const { data: meData } = await httpClient.get<{ user: User }>(API_ENDPOINTS.AUTH_ME, {
            headers: { Authorization: `Bearer ${refreshData.access_token}` },
          });
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
    const { data } = await httpClient.post<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
    }>(API_ENDPOINTS.AUTH_GOOGLE, { credential });

    const { data: meData } = await httpClient.get<{ user: User }>(API_ENDPOINTS.AUTH_ME, {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });

    localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(meData.user));
    setUser(meData.user);
  }, []);

  const logout = useCallback(async () => {
    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    try {
      if (refresh) await httpClient.post(API_ENDPOINTS.AUTH_LOGOUT, { refresh_token: refresh });
    } catch { /* ignore */ }
    clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
