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
  stage?: string,
  candidateType?: string,
  archived?: boolean,
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
  if (stage) params.stage = stage;
  if (candidateType) params.candidate_type = candidateType;
  if (archived !== undefined) params.archived = String(archived);
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

export type UpdateCandidateRoundStatusPayload = {
  stage: string;
  status: string;
  current_round_id: string;
  scheduled_at?: string;
};

export type UpdateCandidateRoundStatusResponse = {
  success: boolean;
};

export const updateCandidateRoundStatus = async (
  candidateId: number,
  payload: UpdateCandidateRoundStatusPayload,
): Promise<UpdateCandidateRoundStatusResponse> => {
  const { data } = await httpClient.patch<UpdateCandidateRoundStatusResponse>(
    API_ENDPOINTS.APPLICATION_ROUND_STATUS.replace("{candidate_id}", String(candidateId)),
    payload,
  );
  return data;
};

export type UpdateCandidateArchivePayload = {
  archived: boolean;
};

export type UpdateCandidateArchiveResponse = {
  success: boolean;
  archived: boolean;
};

export const resumeCandidateFromHold = async (candidateId: number): Promise<{ id: number; final_verdict: string | null }> => {
  const { data } = await httpClient.post<{ id: number; final_verdict: string | null }>(
    API_ENDPOINTS.APPLICATION_RESUME.replace("{candidate_id}", String(candidateId)),
  );
  return data;
};

export const updateCandidateArchive = async (
  candidateId: number,
  payload: UpdateCandidateArchivePayload,
): Promise<UpdateCandidateArchiveResponse> => {
  const { data } = await httpClient.patch<UpdateCandidateArchiveResponse>(
    API_ENDPOINTS.APPLICATION_ARCHIVE.replace("{candidate_id}", String(candidateId)),
    payload,
  );
  return data;
};

export type CandidateDetailsUpdatePayload = {
  phone: string;
  linkedin_url: string;
  how_did_you_hear: string;
  location: string;
  current_ctc: string;
  expected_ctc: string;
  years_of_experience: string;
  notice_period: string;
  willing_to_relocate: boolean;
};

export const updateCandidateDetails = async (
  candidateId: number,
  payload: CandidateDetailsUpdatePayload,
): Promise<EvaluatedCandidate> => {
  const { data } = await httpClient.patch<EvaluatedCandidate>(
    API_ENDPOINTS.APPLICATION_CANDIDATE_DETAILS.replace("{candidate_id}", String(candidateId)),
    payload,
  );
  return data;
};
