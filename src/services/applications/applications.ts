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

export const fetchApplicationById = async (applicationId: string): Promise<EvaluatedCandidate> => {
  const { data } = await httpClient.get<EvaluatedCandidate>(
    `${API_ENDPOINTS.APPLICATIONS_BY_ID}candidate/${applicationId}`,
  );
  return data;
};

export const fetchApplicationsPaginated = async (
  jobId?: string,
  status?: string,
  minScore?: number,
  maxScore?: number,
  dateFrom?: string,
  dateTo?: string,
  limit?: number,
  offset?: number,
  schedule?: string,
  q?: string,
): Promise<PaginatedEvaluatedCandidatesResponse> => {
  const params: Record<string, string> = {};
  if (jobId) params.job_id = jobId;
  if (status && status !== FILTER_DEFAULTS.ALL) params.status = status;
  if (minScore !== undefined) params.min_score = String(minScore);
  if (maxScore !== undefined) params.max_score = String(maxScore);
  if (dateFrom) params.date_from = dateFrom;
  if (dateTo) params.date_to = dateTo;
  if (limit !== undefined) params.limit = String(limit);
  if (offset !== undefined) params.offset = String(offset);
  if (schedule && schedule !== FILTER_DEFAULTS.ALL) params.schedule = schedule;
  if (q) params.q = q;
  const { data } = await httpClient.get<PaginatedEvaluatedCandidatesResponse>(
    API_ENDPOINTS.APPLICATIONS,
    { params },
  );
  return data;
};
