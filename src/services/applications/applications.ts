import httpClient from "@/services/http-client";
import type { EvaluatedCandidate, EvaluatedCandidatesResponse, PaginatedEvaluatedCandidatesResponse, RoundDetailApiResponse, RoundsApiResponse } from "./applications.types";
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

export const fetchRoundsByCandidateId = async (candidateId: number): Promise<RoundsApiResponse> => {
  const { data } = await httpClient.get<RoundsApiResponse>(
    `${API_ENDPOINTS.ROUNDS}candidate/${candidateId}`,
  );
  return data;
};

export const fetchRoundDetail = async (roundId: string): Promise<RoundDetailApiResponse> => {
  const { data } = await httpClient.get<RoundDetailApiResponse>(
    `${API_ENDPOINTS.ROUNDS}${roundId}`,
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
  finalVerdict?: string,
  roundVerdict?: string,
  rejectReason?: string,
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
  if (finalVerdict !== undefined) params.final_verdict = finalVerdict;
  if (roundVerdict && roundVerdict !== FILTER_DEFAULTS.ALL) params.round_verdict = roundVerdict;
  if (rejectReason) params.reject_reason = rejectReason;
  const { data } = await httpClient.get<PaginatedEvaluatedCandidatesResponse>(
    API_ENDPOINTS.APPLICATIONS,
    { params },
  );
  return data;
};

export const fetchFinalVerdicts = async (
  candidateStatus?: string,
  limit?: number,
  offset?: number,
  jobId?: string,
): Promise<PaginatedEvaluatedCandidatesResponse> => {
  const params: Record<string, string> = {};
  if (jobId) params.job_id = jobId;
  if (candidateStatus) params.candidate_status = candidateStatus;
  if (limit !== undefined) params.limit = String(limit);
  if (offset !== undefined) params.offset = String(offset);
  const { data } = await httpClient.get<PaginatedEvaluatedCandidatesResponse>(
    API_ENDPOINTS.FINAL_VERDICTS,
    { params },
  );
  return data;
};
