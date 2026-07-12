import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

type UpdateReviewByRoundBody = {
  entity_type: string;
  reviews: Record<string, unknown>;
  verdict: string;
};

type ReviewApiResponse = {
  id: string;
  round_id: string;
  entity_type: string;
  reviews: Record<string, unknown> | null;
  verdict: string | null;
  created_at: string;
  updated_at: string;
};

export const updateReviewByRound = async (
  roundId: string,
  body: UpdateReviewByRoundBody,
): Promise<ReviewApiResponse> => {
  const { data } = await httpClient.put<ReviewApiResponse>(
    `${API_ENDPOINTS.REVIEWS_ROUND}/${roundId}`,
    body,
  );
  return data;
};

type FinalVerdictResponse = {
  id: number;
  candidate_id: number;
  status: string;
  final_verdict: string;
};

export const updateFinalVerdict = async (
  candidateId: number,
  verdict: "SELECTED" | "REJECTED",
): Promise<FinalVerdictResponse> => {
  const { data } = await httpClient.patch<FinalVerdictResponse>(
    API_ENDPOINTS.FINAL_VERDICT.replace("{candidate_id}", String(candidateId)),
    { verdict },
  );
  return data;
};
