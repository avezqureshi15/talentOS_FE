import httpClient from "@/services/http-client";
import type { EvaluatedCandidate, EvaluatedCandidatesResponse, PaginatedEvaluatedCandidatesResponse } from "./applications.types";
import { API_ENDPOINTS, FILTER_DEFAULTS } from "@/constants/api-endpoints";

export const fetchApplications = async (jobId?: string, status?: string): Promise<EvaluatedCandidate[]> => {
  const params: Record<string, string> = {};
  if (jobId) params.job_id = jobId;
  if (status && status !== FILTER_DEFAULTS.ALL) params.status = status;
  const { data } = await httpClient.get<EvaluatedCandidatesResponse>(API_ENDPOINTS.APPLICATIONS, { params });
  return data.data;
};

export const fetchApplicationsPaginated = async (
  jobId?: string,
  status?: string,
  minScore?: number,
  maxScore?: number,
  limit?: number,
  offset?: number,
): Promise<PaginatedEvaluatedCandidatesResponse> => {
  const params: Record<string, string> = {};
  if (jobId) params.job_id = jobId;
  if (status && status !== FILTER_DEFAULTS.ALL) params.status = status;
  if (minScore !== undefined) params.min_score = String(minScore);
  if (maxScore !== undefined) params.max_score = String(maxScore);
  if (limit !== undefined) params.limit = String(limit);
  if (offset !== undefined) params.offset = String(offset);
  const { data } = await httpClient.get<PaginatedEvaluatedCandidatesResponse>(
    API_ENDPOINTS.APPLICATIONS,
    { params },
  );
  return data;
};
