import httpClient from "@/services/http-client";
import type { HiringRequestsListResponse } from "@/services/hiring-requests/hiring-requests.types";
import type { PaginatedEmployees } from "@/app/admin/employees/pages/employees-page.types";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export const searchEmployees = async (
  q: string,
  page: number = 1,
  perPage: number = 5,
): Promise<PaginatedEmployees> => {
  const params: Record<string, string | number> = { page, per_page: perPage };
  if (q.trim()) params.q = q.trim();
  const { data } = await httpClient.get<PaginatedEmployees>(API_ENDPOINTS.EMPLOYEES, { params });
  return data;
};

export const searchHiringRequests = async (
  q: string,
  page: number = 1,
  perPage: number = 5,
): Promise<HiringRequestsListResponse> => {
  const params: Record<string, string | number> = { page, per_page: perPage };
  if (q.trim()) {
    params.q = q.trim();
  }

  const { data } = await httpClient.get<HiringRequestsListResponse>("/hiring-requests/", { params });
  return data;
};
