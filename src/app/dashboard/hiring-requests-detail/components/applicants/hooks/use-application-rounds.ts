import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import { fetchRoundsByCandidateId } from "@/services/applications/applications";
import { displayRoundName, type RoundListItem } from "../round-display.helpers";

const mapRoundListItem = (r: {
  id: string;
  name: string | null;
  round_verdict: string | null;
  created_at: string;
}): RoundListItem => ({
  id: r.id,
  round: displayRoundName(r.name),
  roundVerdict: r.round_verdict,
  createdAt: r.created_at,
});

export const useApplicationRounds = (candidateId: number, enabled = true) => {
  return useQuery<RoundListItem[]>({
    queryKey: [QUERY_KEYS.ROUNDS, candidateId],
    queryFn: async () => {
      const data = await fetchRoundsByCandidateId(candidateId);
      return data.map(mapRoundListItem);
    },
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    enabled: enabled && candidateId > 0,
  });
};
