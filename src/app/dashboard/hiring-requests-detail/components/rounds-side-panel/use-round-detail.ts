import { useQuery } from "@tanstack/react-query";
import { fetchRoundDetail } from "@/services/applications/applications";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import type { RoundDetailApiResponse, ReviewEntity as ApiReviewEntity } from "@/services/applications/applications.types";
import type { RoundDetail, ReviewEntity } from "./rounds-side-panel.types";

function mapReview(api: ApiReviewEntity): ReviewEntity {
  return {
    entityType: api.entity_type,
    verdict: api.verdict,
    ratings: (api.ratings ?? []).map((rt) => ({
      label: rt.label,
      score: rt.score,
      maxScore: rt.max_score,
    })),
    skills: (api.skills as string[]) ?? [],
    notes: (api.notes as string) ?? "",
    summary: (api.summary as string) ?? (api.summary_md as string) ?? undefined,
    strongMatches: Array.isArray(api.strong_matches) ? (api.strong_matches as string[]) : [],
    gapsAndConcerns: Array.isArray(api.gaps_and_concerns) ? (api.gaps_and_concerns as string[]) : [],
    remarks: (api.remarks as string) ?? undefined,
    rejectedStatus: Array.isArray(api.rejected_status) ? (api.rejected_status as string[]) : [],
    rejectedReason: (api.rejected_reason as string) ?? undefined,
    averageRating: (api.average_rating as number) ?? undefined,
  };
}

function mapRoundDetail(api: RoundDetailApiResponse): RoundDetail {
  return {
    id: api.id,
    round: api.round ?? "",
    interviewer: api.interviewer ?? "",
    role: api.role ?? "",
    jdLabel: api.jd_label ?? "",
    candidate: api.candidate ?? "",
    occurredOn: api.occurred_on ?? "",
    slot: api.slot ?? "",
    duration: api.duration ?? "",
    interviewType: api.interview_type ?? "",
    status: api.status ?? "",
    reviews: (api.reviews ?? []).map(mapReview),
  };
}

export function useRoundDetail(roundId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEYS.ROUND_DETAIL, roundId],
    queryFn: () => fetchRoundDetail(roundId!),
    enabled: !!roundId,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    select: mapRoundDetail,
  });
}
