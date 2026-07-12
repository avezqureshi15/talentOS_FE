import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { AlertsApiResponse } from "./alerts.types";

export const fetchAlerts = async (
  type: string | undefined,
  page: number,
  perPage: number,
  isRead?: boolean,
): Promise<AlertsApiResponse> => {
  const params: Record<string, string> = {};
  if (type) params.type = type;
  if (isRead !== undefined) params.is_read = String(isRead);
  params.page = String(page);
  params.per_page = String(perPage);
  const { data } = await httpClient.get<AlertsApiResponse>(
    API_ENDPOINTS.ALERTS,
    { params },
  );
  return data;
};
