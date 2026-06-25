import httpClient from "@/services/http-client";
import type {
  HiringRequest,
  HiringRequestsFilters,
  HiringRequestsListResponse,
  HiringRequestDetailResponse,
  DepartmentsResponse,
} from "./hiring-requests.types";
import { API_ENDPOINTS, PAGINATION } from "@/constants/api-endpoints";

export const fetchDepartments = async (): Promise<string[]> => {
  const { data } = await httpClient.get<DepartmentsResponse>(API_ENDPOINTS.HIRING_REQUESTS_DEPARTMENTS);
  return data.data;
};

export const fetchLocations = async (): Promise<string[]> => {
  const { data } = await httpClient.get<DepartmentsResponse>(API_ENDPOINTS.HIRING_REQUESTS_LOCATIONS);
  return data.data;
};

export const fetchTypes = async (): Promise<string[]> => {
  const { data } = await httpClient.get<DepartmentsResponse>(API_ENDPOINTS.HIRING_REQUESTS_TYPES);
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
    page: filters?.page ?? PAGINATION.DEFAULT_PAGE,
    per_page: filters?.per_page ?? PAGINATION.DEFAULT_PER_PAGE,
  };
  const clean = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ""));
  const { data } = await httpClient.get<HiringRequestsListResponse>(API_ENDPOINTS.HIRING_REQUESTS, { params: clean });
  return data;
};

export const fetchHiringRequestById = async (id: string): Promise<HiringRequest> => {
  const { data } = await httpClient.get<HiringRequestDetailResponse>(`${API_ENDPOINTS.HIRING_REQUESTS}${id}`);
  return data.data;
};

export const toggleHiringRequestStatus = async (id: string): Promise<HiringRequest> => {
  const { data } = await httpClient.patch<HiringRequestDetailResponse>(`${API_ENDPOINTS.HIRING_REQUESTS}${id}/status`);
  return data.data;
};
