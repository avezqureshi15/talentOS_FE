import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import { fetchRoundsByCandidateId } from "@/services/applications/applications";
import type { InterviewRound } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

const mapRoundToInterviewRound = (r: {
  id: string;
  name: string | null;
  created_at: string;
}): InterviewRound => ({
  id: r.id,
  round: r.name ?? "Untitled Round",
  interviewer: "",
  role: "",
  jdHref: "",
  jdLabel: "",
  candidate: "",
  occurredOn: r.created_at,
  slot: "",
  duration: "",
  interviewType: "",
  status: "",
  ratings: [],
  skills: [],
  notes: "",
  aiSummary: "",
  verdict: "hold",
  aiDecision: "pending",
  hrDecision: "pending",
});

export const useApplicationRounds = (candidateId: number) => {
  const query = useQuery<InterviewRound[]>({
    queryKey: [QUERY_KEYS.ROUNDS, candidateId],
    queryFn: async () => {
      const data = await fetchRoundsByCandidateId(candidateId);
      return data.map(mapRoundToInterviewRound);
    },
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    enabled: candidateId > 0,
  });

  return query;
};
