import httpClient from "@/services/http-client";
import type { EvaluatedCandidate, EvaluatedCandidatesResponse } from "./applications.types";

export const fetchApplications = async (jobId?: string, status?: string): Promise<EvaluatedCandidate[]> => {
  const params: Record<string, string> = {};
  if (jobId) params.job_id = jobId;
  if (status && status !== "all") params.status = status;
  const { data } = await httpClient.get<EvaluatedCandidatesResponse>("/applications/", { params });
  return data.data;
};
