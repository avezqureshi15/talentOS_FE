import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { InterviewsApiResponse } from "./interviews.types";

export const fetchInterviews = async (
  statusFilter: string | undefined,
  page: number,
  perPage: number,
  search?: string,
  candidateId?: string,
  hiringRequestId?: string,
): Promise<InterviewsApiResponse> => {
  const params: Record<string, string> = {};
  if (statusFilter) params.status_filter = statusFilter;
  if (search) params.search = search;
  if (candidateId) params.candidate_id = candidateId;
  if (hiringRequestId) params.hiring_request_id = hiringRequestId;
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

export type RescheduleInterviewPayload = {
  slot_id: string;
};

export type RescheduleInterviewResponse = {
  id: string;
  round_id: string;
  slot_id: string | null;
  event_id: string | null;
  meet_link: string | null;
  status: string;
};

export const rescheduleInterview = async (
  interviewId: string,
  payload: RescheduleInterviewPayload,
): Promise<RescheduleInterviewResponse> => {
  const { data } = await httpClient.patch<RescheduleInterviewResponse>(
    `${API_ENDPOINTS.INTERVIEWS_SCHEDULING}/${interviewId}/reschedule`,
    payload,
  );
  return data;
};

export type CancelInterviewResponse = {
  id: string;
  status: string;
};

export const cancelInterview = async (
  interviewId: string,
): Promise<CancelInterviewResponse> => {
  const { data } = await httpClient.patch<CancelInterviewResponse>(
    `${API_ENDPOINTS.INTERVIEWS_SCHEDULING}/${interviewId}/cancel`,
  );
  return data;
};
