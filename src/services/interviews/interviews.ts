import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { InterviewsApiResponse } from "./interviews.types";

export const fetchInterviews = async (
  statusFilter: string | undefined,
  page: number,
  perPage: number,
): Promise<InterviewsApiResponse> => {
  const params: Record<string, string> = {};
  if (statusFilter) params.status_filter = statusFilter;
  params.page = String(page);
  params.per_page = String(perPage);
  const { data } = await httpClient.get<InterviewsApiResponse>(
    API_ENDPOINTS.INTERVIEWS,
    { params },
  );
  return data;
};
