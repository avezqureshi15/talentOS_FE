import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { AiScreeningResult, AiInterviewItem, AiInterviewDetail, MoveToScreeningResponse, MoveToScreeningPayload, TriggerInterviewPayload, TriggerInterviewResponse } from "./ai.types";

export const fetchAiScreeningResult = async (hiringRequestId: string, candidateId: number): Promise<AiScreeningResult> => {
  const url = API_ENDPOINTS.AI_SCREENING.replace("{hiring_request_id}", hiringRequestId).replace("{candidate_id}", String(candidateId));
  const { data } = await httpClient.get<AiScreeningResult>(url);
  return data;
};

export const fetchAiInterviews = async (hiringRequestId: string, candidateId: number): Promise<AiInterviewItem[]> => {
  const url = API_ENDPOINTS.AI_INTERVIEWS.replace("{hiring_request_id}", hiringRequestId).replace("{candidate_id}", String(candidateId));
  const { data } = await httpClient.get<AiInterviewItem[]>(url);
  return data;
};

export const fetchAiInterviewDetail = async (hiringRequestId: string, candidateId: number, interviewId: string): Promise<AiInterviewDetail> => {
  const url = API_ENDPOINTS.AI_INTERVIEWS.replace("{hiring_request_id}", hiringRequestId).replace("{candidate_id}", String(candidateId)) + `/${interviewId}`;
  const { data } = await httpClient.get<AiInterviewDetail>(url);
  return data;
};

export const moveToScreening = async (hiringRequestId: string, candidateId: number, payload: MoveToScreeningPayload): Promise<MoveToScreeningResponse> => {
  const url = API_ENDPOINTS.AI_MOVE_TO_SCREENING.replace("{hiring_request_id}", hiringRequestId).replace("{candidate_id}", String(candidateId));
  const { data } = await httpClient.post<MoveToScreeningResponse>(url, payload);
  return data;
};

export const triggerAiInterview = async (hiringRequestId: string, candidateId: number, payload: TriggerInterviewPayload): Promise<TriggerInterviewResponse> => {
  const url = API_ENDPOINTS.AI_TRIGGER_INTERVIEW.replace("{hiring_request_id}", hiringRequestId).replace("{candidate_id}", String(candidateId));
  const { data } = await httpClient.post<TriggerInterviewResponse>(url, payload);
  return data;
};
