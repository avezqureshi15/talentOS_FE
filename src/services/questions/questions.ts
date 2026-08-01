import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type {
  GenerateDesignQuestionsPayload,
  InterviewDesign,
  UpdateInterviewDesignPayload,
} from "./questions.types";

export const getHiringRequestDesign = async (
  hiringRequestId: string,
): Promise<InterviewDesign> => {
  const { data } = await httpClient.get<InterviewDesign>(
    API_ENDPOINTS.AI_QUESTIONS.replace("{hiring_request_id}", hiringRequestId),
  );
  return data;
};

export const updateHiringRequestDesign = async (
  hiringRequestId: string,
  payload: UpdateInterviewDesignPayload,
): Promise<InterviewDesign> => {
  const { data } = await httpClient.put<InterviewDesign>(
    API_ENDPOINTS.AI_QUESTIONS.replace("{hiring_request_id}", hiringRequestId),
    payload,
  );
  return data;
};

export const generateHiringRequestDesignQuestions = async (
  hiringRequestId: string,
  payload: GenerateDesignQuestionsPayload,
): Promise<InterviewDesign> => {
  const { data } = await httpClient.post<InterviewDesign>(
    API_ENDPOINTS.AI_QUESTIONS_GENERATE.replace("{hiring_request_id}", hiringRequestId),
    payload,
    { toastOnError: false },
  );
  return data;
};
