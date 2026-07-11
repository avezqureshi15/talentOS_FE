import { useQuery } from "@tanstack/react-query";
import { fetchRoundDetail } from "@/services/applications/applications";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import type { RoundDetailApiResponse } from "@/services/applications/applications.types";
import type { RoundDetail } from "./rounds-side-panel.types";

function mapRoundDetail(api: RoundDetailApiResponse): RoundDetail {
  const ratings = (api.ratings ?? []).map((r) => ({
    label: r.label,
    score: r.score,
    maxScore: r.max_score,
    entityType: r.entity_type,
  }));

  const decisions = api.decisions ?? {};

  const result: RoundDetail = {
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
    ratings,
    skills: api.skills,
    notes: api.notes ?? "",
    aiSummary: api.ai_summary ?? "",
    strongMatches: Array.isArray(api.strong_matches) ? api.strong_matches : [],
    gapsAndConcerns: Array.isArray(api.gaps_and_concerns) ? api.gaps_and_concerns : [],
  };

  if ("interviewer_decision" in decisions) {
    result.verdict = decisions.interviewer_decision as RoundDetail["verdict"];
  }
  if ("ai_decision" in decisions) {
    result.aiDecision = decisions.ai_decision as RoundDetail["aiDecision"];
  }
  if ("hr_decision" in decisions) {
    result.hrDecision = decisions.hr_decision as RoundDetail["hrDecision"];
  }

  return result;
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
