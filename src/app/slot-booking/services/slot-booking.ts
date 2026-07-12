import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { FormValidateResponse, SlotsCreateRequest, SlotsCreateResponse } from "./slot-booking.types";

export const validateForm = async (formId: string): Promise<FormValidateResponse> => {
  const { data } = await httpClient.get<FormValidateResponse>(
    `${API_ENDPOINTS.FORMS_VALIDATE}${formId}`,
    { toastOnError: false },
  );
  return data;
};

export const createSlots = async (payload: SlotsCreateRequest): Promise<SlotsCreateResponse> => {
  const { data } = await httpClient.post<SlotsCreateResponse>(
    API_ENDPOINTS.SLOTS_CREATE,
    payload,
  );
  return data;
};
