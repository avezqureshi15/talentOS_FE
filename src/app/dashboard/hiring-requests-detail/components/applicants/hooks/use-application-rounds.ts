import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import { fetchRoundsByCandidateId } from "@/services/applications/applications";

type RoundListItem = {
  id: string;
  round: string;
  roundVerdict: string | null;
};

const mapRoundListItem = (r: {
  id: string;
  name: string | null;
  round_verdict: string | null;
}): RoundListItem => ({
  id: r.id,
  round: r.name ?? "Untitled Round",
  roundVerdict: r.round_verdict,
});

export const useApplicationRounds = (candidateId: number) => {
  const query = useQuery<RoundListItem[]>({
    queryKey: [QUERY_KEYS.ROUNDS, candidateId],
    queryFn: async () => {
      const data = await fetchRoundsByCandidateId(candidateId);
      return data.map(mapRoundListItem);
    },
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    enabled: candidateId > 0,
  });

  return query;
};
