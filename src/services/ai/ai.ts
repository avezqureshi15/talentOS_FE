import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { AiScreeningResult, AiInterviewItem, AiInterviewDetail, MoveToScreeningResponse, MoveToScreeningPayload, MoveToInterviewPayload, MoveToInterviewResponse, AiRetryResponse, AiInterviewRecordingResponse, AiInterviewSchedulePayload, AiInterviewScheduleResponse, AiInterviewUnscheduleResponse, AiScreenTriggerResponse } from "./ai.types";
import type { CandidateEvaluationData } from "@/app/dashboard/round-details/pages/round-details.types";

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

export const fetchAiInterviewTemplate = async (
  hiringRequestId: string,
  candidateId: number,
  interviewId: string,
): Promise<CandidateEvaluationData> => {
  const url = API_ENDPOINTS.AI_INTERVIEW_TEMPLATE
    .replace("{hiring_request_id}", hiringRequestId)
    .replace("{candidate_id}", String(candidateId))
    .replace("{interview_id}", interviewId);
  const { data } = await httpClient.get<CandidateEvaluationData>(url);
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

export const moveToInterview = async (hiringRequestId: string, candidateId: number, payload: MoveToInterviewPayload): Promise<MoveToInterviewResponse> => {
  const url = API_ENDPOINTS.AI_MOVE_TO_INTERVIEW.replace("{hiring_request_id}", hiringRequestId).replace("{candidate_id}", String(candidateId));
  const { data } = await httpClient.post<MoveToInterviewResponse>(url, payload);
  return data;
};

export const retryAiScreening = async (hiringRequestId: string, candidateId: number): Promise<AiRetryResponse> => {
  const url = API_ENDPOINTS.AI_RETRY_SCREENING.replace("{hiring_request_id}", hiringRequestId).replace("{candidate_id}", String(candidateId));
  const { data } = await httpClient.post<AiRetryResponse>(url);
  return data;
};

export const retryAiInterview = async (hiringRequestId: string, candidateId: number): Promise<AiRetryResponse> => {
  const url = API_ENDPOINTS.AI_RETRY_INTERVIEW.replace("{hiring_request_id}", hiringRequestId).replace("{candidate_id}", String(candidateId));
  const { data } = await httpClient.post<AiRetryResponse>(url);
  return data;
};

export const fetchAiInterviewRecordingUrl = async (hiringRequestId: string, candidateId: number, interviewId: string): Promise<AiInterviewRecordingResponse> => {
  const url = API_ENDPOINTS.AI_INTERVIEW_RECORDING.replace("{hiring_request_id}", hiringRequestId).replace("{candidate_id}", String(candidateId)).replace("{interview_id}", interviewId);
  const { data } = await httpClient.get<AiInterviewRecordingResponse>(url);
  return data;
};

export const scheduleAiInterview = async (hiringRequestId: string, candidateId: number, payload: AiInterviewSchedulePayload): Promise<AiInterviewScheduleResponse> => {
  const url = API_ENDPOINTS.AI_INTERVIEW_SCHEDULE.replace("{hiring_request_id}", hiringRequestId).replace("{candidate_id}", String(candidateId));
  const { data } = await httpClient.post<AiInterviewScheduleResponse>(url, payload);
  return data;
};

export const unscheduleAiInterview = async (hiringRequestId: string, candidateId: number): Promise<AiInterviewUnscheduleResponse> => {
  const url = API_ENDPOINTS.AI_INTERVIEW_UNSCHEDULE.replace("{hiring_request_id}", hiringRequestId).replace("{candidate_id}", String(candidateId));
  const { data } = await httpClient.post<AiInterviewUnscheduleResponse>(url);
  return data;
};

export const triggerScreeningCall = async (hiringRequestId: string, candidateId: number): Promise<AiScreenTriggerResponse> => {
  const url = API_ENDPOINTS.AI_TRIGGER_SCREENING.replace("{hiring_request_id}", hiringRequestId).replace("{candidate_id}", String(candidateId));
  const { data } = await httpClient.post<AiScreenTriggerResponse>(url);
  return data;
};
