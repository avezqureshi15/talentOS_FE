import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { AlertsApiResponse } from "./alerts.types";

export const fetchAlerts = async (
  type: string | undefined,
  page: number,
  perPage: number,
  isRead?: boolean,
  search?: string,
): Promise<AlertsApiResponse> => {
  const params: Record<string, string> = {};
  if (type) params.type = type;
  if (isRead !== undefined) params.is_read = String(isRead);
  if (search) params.search = search;
  params.page = String(page);
  params.per_page = String(perPage);
  const { data } = await httpClient.get<AlertsApiResponse>(
    API_ENDPOINTS.ALERTS,
    { params },
  );
  return data;
};

export type NotifyFormResponse = {
  message: string;
  detail: string;
  form_id: string;
};

export const sendNotification = async (
  user_id: number,
  type: string,
  reminder?: boolean,
): Promise<NotifyFormResponse> => {
  try {
    const { data } = await httpClient.post<NotifyFormResponse>(
      API_ENDPOINTS.FORMS_NOTIFY,
      { user_id, type, reminder },
      { toastOnError: false },
    );
    return data;
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { detail?: string; error?: string; message?: string } } };
    const msg =
      axiosErr.response?.data?.detail ||
      axiosErr.response?.data?.error ||
      axiosErr.response?.data?.message ||
      "Notification failed";
    throw new Error(msg);
  }
};
