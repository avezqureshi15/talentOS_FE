import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { getApiErrorMessage } from "@/utils/api-error";
import type {
  NotificationsApiResponse,
  UnreadCountApiResponse,
} from "./notifications.types";

export type FetchNotificationsParams = {
  page?: number;
  perPage?: number;
  type?: string;
  types?: string[];
  excludeTypes?: string[];
  isRead?: boolean;
  search?: string;
};

export const fetchNotifications = async (
  params: FetchNotificationsParams = {},
): Promise<NotificationsApiResponse> => {
  const query: Record<string, string> = {};
  if (params.page !== undefined) query.page = String(params.page);
  if (params.perPage !== undefined) query.per_page = String(params.perPage);
  if (params.type) query.type = params.type;
  if (params.types?.length) query.types = params.types.join(",");
  if (params.excludeTypes?.length) query.exclude_types = params.excludeTypes.join(",");
  if (params.isRead !== undefined) query.is_read = String(params.isRead);
  if (params.search) query.search = params.search;
  const { data } = await httpClient.get<NotificationsApiResponse>(
    API_ENDPOINTS.NOTIFICATIONS,
    { params: query, toastOnError: false },
  );
  return data;
};

export const fetchUnreadCount = async (): Promise<number> => {
  const { data } = await httpClient.get<UnreadCountApiResponse>(
    API_ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT,
    { toastOnError: false },
  );
  return data.data.unread_count;
};

export const markNotificationRead = async (notificationId: string): Promise<void> => {
  await httpClient.patch(API_ENDPOINTS.NOTIFICATIONS_READ.replace("{notification_id}", notificationId));
};

export const markAllNotificationsRead = async (type?: string): Promise<number> => {
  const params: Record<string, string> = {};
  if (type) params.type = type;
  const { data } = await httpClient.patch<{ success: boolean; data: { updated: number } }>(
    API_ENDPOINTS.NOTIFICATIONS_READ_ALL,
    undefined,
    { params },
  );
  return data.data.updated;
};

export type NotifyFormResponse = {
  message: string;
  detail: string;
  form_id: string;
};

export const sendReminder = async (
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
    throw new Error(getApiErrorMessage(err, "Notification failed"), { cause: err });
  }
};

export const sendReminderByForm = async (formId: string): Promise<NotifyFormResponse> => {
  try {
    const { data } = await httpClient.post<NotifyFormResponse>(
      API_ENDPOINTS.FORMS_REMIND.replace("{form_id}", formId),
      undefined,
      { toastOnError: false },
    );
    return data;
  } catch (err: unknown) {
    throw new Error(getApiErrorMessage(err, "Reminder failed"), { cause: err });
  }
};
