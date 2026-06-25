import httpClient from "@/services/http-client";
import type { EvaluatedCandidate, EvaluatedCandidatesResponse } from "./applications.types";
import { API_ENDPOINTS, FILTER_DEFAULTS } from "@/constants/api-endpoints";

export const fetchApplications = async (jobId?: string, status?: string): Promise<EvaluatedCandidate[]> => {
  const params: Record<string, string> = {};
  if (jobId) params.job_id = jobId;
  if (status && status !== FILTER_DEFAULTS.ALL) params.status = status;
  const { data } = await httpClient.get<EvaluatedCandidatesResponse>(API_ENDPOINTS.APPLICATIONS, { params });
  return data.data;
};
