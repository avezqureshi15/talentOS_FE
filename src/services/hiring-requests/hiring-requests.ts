import httpClient from "@/services/http-client";
import type {
  HiringRequest,
  HiringRequestsListResponse,
  HiringRequestDetailResponse,
} from "./hiring-requests.types";

export const fetchHiringRequests = async (): Promise<HiringRequest[]> => {
  const { data } = await httpClient.get<HiringRequestsListResponse>("/hiring-requests/");
  return data.data;
};

export const fetchHiringRequestById = async (id: string): Promise<HiringRequest> => {
  const { data } = await httpClient.get<HiringRequestDetailResponse>(`/hiring-requests/${id}`);
  return data.data;
};
