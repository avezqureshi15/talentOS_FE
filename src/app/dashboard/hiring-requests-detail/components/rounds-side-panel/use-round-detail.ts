import { useQuery } from "@tanstack/react-query";
import { fetchRoundDetail } from "@/services/applications/applications";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import type { RoundDetailApiResponse, ReviewEntity as ApiReviewEntity } from "@/services/applications/applications.types";
import type { RoundDetail, ReviewEntity } from "./rounds-side-panel.types";
import { normalizeReviewPhases } from "@/app/dashboard/hiring-requests-detail/components/review-phases-accordion/review-phases-accordion.helpers";

const SKIP_COMPARISON_KEYS = new Set([
  "entity_type", "verdict", "ratings", "skills", "notes",
  "summary", "summary_md", "strong_matches", "gaps_and_concerns",
  "remarks", "rejection_details", "rejected_status", "rejected_reason",
  "average_rating", "phases", "questions_source",
]);

function extractComparisonFields(api: ApiReviewEntity) {
  const fields: { label: string; actual: string; expected: string }[] = [];
  for (const key of Object.keys(api)) {
    if (SKIP_COMPARISON_KEYS.has(key)) continue;
    const val = api[key];
    if (val && typeof val === "object" && !Array.isArray(val) && "actual" in val && "expected" in val) {
      fields.push({ label: key, actual: String(val.actual), expected: String(val.expected) });
    }
  }
  return fields;
}

function mapReview(api: ApiReviewEntity): ReviewEntity {
  return {
    entityType: api.entity_type,
    verdict: api.verdict,
    ratings: (api.ratings ?? []).map((rt) => ({
      label: rt.label,
      score: rt.score,
      maxScore: rt.max_score,
    })),
    phases: normalizeReviewPhases(api.phases),
    skills: (api.skills as string[]) ?? [],
    notes: (api.notes as string) ?? "",
    summary: (api.summary as string) ?? (api.summary_md as string) ?? undefined,
    strongMatches: Array.isArray(api.strong_matches) ? (api.strong_matches as string[]) : [],
    gapsAndConcerns: Array.isArray(api.gaps_and_concerns) ? (api.gaps_and_concerns as string[]) : [],
    remarks: (api.remarks as string) ?? undefined,
    rejectionDetails: Array.isArray(api.rejection_details) ? (api.rejection_details as Array<Record<string, { JD: string; Candidate: string }>>) : [],
    comparisonFields: extractComparisonFields(api),
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
