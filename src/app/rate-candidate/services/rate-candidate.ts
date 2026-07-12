import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { FormValidateResponse, FormSubmitResponse, ReviewSubmitRequest, ReviewSubmitResponse } from "./rate-candidate.types";

export const validateForm = async (formId: string): Promise<FormValidateResponse> => {
  const { data } = await httpClient.get<FormValidateResponse>(
    `${API_ENDPOINTS.FORMS_VALIDATE}${formId}`,
  );
  return data;
};

export const submitReview = async (
  roundId: string,
  body: ReviewSubmitRequest,
): Promise<ReviewSubmitResponse> => {
  const { data } = await httpClient.put<ReviewSubmitResponse>(
    `${API_ENDPOINTS.REVIEWS_ROUND}/${roundId}`,
    body,
  );
  return data;
};

export const submitForm = async (formId: string): Promise<FormSubmitResponse> => {
  const { data } = await httpClient.post<FormSubmitResponse>(
    `${API_ENDPOINTS.FORMS_SUBMIT}${formId}/submit`,
  );
  return data;
};
