import httpClient from "@/services/http-client";
import type {
  HiringRequest,
  HiringRequestsFilters,
  HiringRequestsListResponse,
  HiringRequestDetailResponse,
  DepartmentsResponse,
} from "./hiring-requests.types";

export const fetchDepartments = async (): Promise<string[]> => {
  const { data } = await httpClient.get<DepartmentsResponse>("/hiring-requests/departments");
  return data.data;
};

export const fetchLocations = async (): Promise<string[]> => {
  const { data } = await httpClient.get<DepartmentsResponse>("/hiring-requests/locations");
  return data.data;
};

export const fetchTypes = async (): Promise<string[]> => {
  const { data } = await httpClient.get<DepartmentsResponse>("/hiring-requests/types");
  return data.data;
};

export const fetchHiringRequests = async (filters?: HiringRequestsFilters): Promise<HiringRequestsListResponse> => {
  const params: Record<string, string | number | boolean | undefined> = {
    q: filters?.q,
    department: filters?.department,
    location: filters?.location,
    type: filters?.type,
    is_active: filters?.is_active,
    created_from: filters?.created_from,
    created_to: filters?.created_to,
    page: filters?.page ?? 1,
    per_page: filters?.per_page ?? 10,
  };
  const clean = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ""));
  const { data } = await httpClient.get<HiringRequestsListResponse>("/hiring-requests/", { params: clean });
  return data;
};

export const fetchHiringRequestById = async (id: string): Promise<HiringRequest> => {
  const { data } = await httpClient.get<HiringRequestDetailResponse>(`/hiring-requests/${id}`);
  return data.data;
};

export const toggleHiringRequestStatus = async (id: string): Promise<HiringRequest> => {
  const { data } = await httpClient.patch<HiringRequestDetailResponse>(`/hiring-requests/${id}/status`);
  return data.data;
};
