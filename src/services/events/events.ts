import httpClient from "@/services/http-client";
import type { EventResponse } from "./events.types";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export const fetchEventsByCandidateId = async (candidateId: number): Promise<EventResponse[]> => {
  const { data } = await httpClient.get<EventResponse[]>(
    `${API_ENDPOINTS.EVENTS_BY_CANDIDATE}${candidateId}`,
    { toastOnError: false },
  );
  return data;
};
