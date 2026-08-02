import { publicClient } from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { RoundDetailApiResponse } from "@/services/applications/applications.types";
import type { FormValidateResponse, FormSubmitResponse, ReviewSubmitRequest, ReviewSubmitResponse } from "./rate-candidate.types";

export const validateForm = async (formId: string): Promise<FormValidateResponse> => {
  const { data } = await publicClient.get<FormValidateResponse>(
    `${API_ENDPOINTS.FORMS_VALIDATE}${formId}`,
  );
  return data;
};

export const fetchRoundDetailPublic = async (roundId: string): Promise<RoundDetailApiResponse> => {
  const { data } = await publicClient.get<RoundDetailApiResponse>(
    `${API_ENDPOINTS.ROUNDS}${roundId}`,
    { toastOnError: false },
  );
  return data;
};

export const submitReview = async (
  roundId: string,
  body: ReviewSubmitRequest,
): Promise<ReviewSubmitResponse> => {
  const { data } = await publicClient.put<ReviewSubmitResponse>(
    `${API_ENDPOINTS.REVIEWS_ROUND}/${roundId}`,
    body,
  );
  return data;
};

export const submitForm = async (formId: string): Promise<FormSubmitResponse> => {
  const { data } = await publicClient.post<FormSubmitResponse>(
    `${API_ENDPOINTS.FORMS_SUBMIT}${formId}/submit`,
  );
  return data;
};
