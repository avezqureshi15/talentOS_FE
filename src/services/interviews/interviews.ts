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

export type BookInterviewPayload = {
  round_name: string;
  slot_id: string;
  jd_id: string;
  candidate_id: number;
  interviewer_ids: number[];
  create_google_meet: boolean;
};

export type BookInterviewResponse = {
  id: string;
  round_id: string;
  slot_id: string | null;
  event_id: string | null;
  meet_link: string | null;
  status: string;
};

export const bookInterview = async (
  payload: BookInterviewPayload,
): Promise<BookInterviewResponse> => {
  const { data } = await httpClient.post<BookInterviewResponse>(
    API_ENDPOINTS.INTERVIEWS_BOOKING,
    payload,
  );
  return data;
};
