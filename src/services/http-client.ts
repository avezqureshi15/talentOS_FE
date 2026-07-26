import axios from "axios";
import { BE_API_BASE_URL } from "@/constants/constants";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/app/auth/hooks/auth.constants";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";

declare module "axios" {
  interface AxiosRequestConfig {
    toastOnError?: boolean;
    skip403Toast?: boolean;
  }
}

const DEFAULT_TIMEOUT = 15_000;

const httpClient = axios.create({
  baseURL: BE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: DEFAULT_TIMEOUT,
});

export const publicClient = axios.create({
  baseURL: BE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: DEFAULT_TIMEOUT,
});

// ── Attach Bearer token to every request ──────────────────────────────
httpClient.interceptors.request.use((config) => {
  if (config.headers?.Authorization) return config;
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auto-refresh on 401 ───────────────────────────────────────────────
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  for (const { resolve, reject } of pendingQueue) {
    if (token) resolve(token);
    else reject(error);
  }
  pendingQueue = [];
};

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ── Handle 403 (role denied / unverified org) ──────────────────────
    if (error.response?.status === 403) {
      if (!originalRequest?.skip403Toast) {
        const message =
          error.response?.data?.error ||
          "You don't have permission to perform this action";
        useToastStore.getState().addToast(message, ToastType.ERROR);
      }
      return Promise.reject(error);
    }

    // ── Handle 423 (locked/disabled) ────────────────────────────────
    if (error.response?.status === 423) {
      useToastStore.getState().addToast(
        error.response?.data?.detail || "Your account has been disabled. Please contact support.",
        ToastType.ERROR,
      );
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem("auth_user");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      if (originalRequest?.toastOnError !== false) {
        const message =
          error.response?.data?.error ||
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred";
        useToastStore.getState().addToast(message, ToastType.ERROR);
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return httpClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!storedRefresh) throw new Error("No refresh token");

      const { data } = await axios.post(
        `${BE_API_BASE_URL}/auth/refresh`,
        { refresh_token: storedRefresh },
      );

      localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
      processQueue(null, data.access_token);

      originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
      return httpClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      const message =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.message ||
        "Session expired. Please sign in again.";
      useToastStore.getState().addToast(message, ToastType.ERROR);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem("auth_user");
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default httpClient;
