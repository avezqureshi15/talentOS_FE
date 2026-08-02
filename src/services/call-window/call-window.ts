import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type {
  CallWindow,
  UpdateCallWindowPayload,
} from "./call-window.types";

export const getHiringRequestCallWindow = async (
  hiringRequestId: string,
): Promise<CallWindow> => {
  const { data } = await httpClient.get<CallWindow>(
    API_ENDPOINTS.CALL_WINDOW.replace("{hiring_request_id}", hiringRequestId),
  );
  return data;
};

export const updateHiringRequestCallWindow = async (
  hiringRequestId: string,
  payload: UpdateCallWindowPayload,
): Promise<CallWindow> => {
  const { data } = await httpClient.put<CallWindow>(
    API_ENDPOINTS.CALL_WINDOW.replace("{hiring_request_id}", hiringRequestId),
    payload,
  );
  return data;
};
