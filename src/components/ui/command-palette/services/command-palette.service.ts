import httpClient from "@/services/http-client";
import type { HiringRequest, HiringRequestsListResponse } from "@/services/hiring-requests/hiring-requests.types";

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
