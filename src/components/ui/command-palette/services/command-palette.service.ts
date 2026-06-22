import httpClient from "@/services/http-client";
import type { HiringRequest } from "@/services/hiring-requests/hiring-requests.types";

type HiringRequestsSearchResponse = {
  data: HiringRequest[];
  count: number;
};

export const searchHiringRequests = async (q: string): Promise<HiringRequest[]> => {
  const params: Record<string, string> = {};
  if (q.trim()) {
    params.q = q.trim();
  }

  const { data } = await httpClient.get<HiringRequestsSearchResponse>("/hiring-requests/", { params });
  return data.data;
};
