import { useQuery } from "@tanstack/react-query";
import {
  AI_INTERVIEW_POLL_INTERVAL_MS,
  AI_INTERVIEW_TERMINAL_STATUSES,
  QUERY_KEYS,
  QUERY_CONFIG,
} from "@/constants/constants";
import { fetchAiInterviewTemplate } from "@/services/ai/ai";
import type { CandidateEvaluationData } from "@/app/dashboard/round-details/pages/round-details.types";

type UseAiInterviewTemplateOptions = {
  poll?: boolean;
};

const shouldKeepPolling = (data: CandidateEvaluationData | undefined) => {
  if (!data) return true;
  const status = (data.status || "").toLowerCase();
  return !AI_INTERVIEW_TERMINAL_STATUSES.has(status);
};

export function useAiInterviewTemplate(
  hiringRequestId: string | undefined,
  candidateId: number | undefined,
  interviewId: string | undefined,
  options: UseAiInterviewTemplateOptions = {},
) {
  return useQuery({
    queryKey: [QUERY_KEYS.AI_INTERVIEW_TEMPLATE, hiringRequestId, candidateId, interviewId],
    queryFn: () => fetchAiInterviewTemplate(hiringRequestId!, candidateId!, interviewId!),
    enabled: !!hiringRequestId && !!candidateId && !!interviewId,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    refetchInterval: options.poll
      ? (query) => (shouldKeepPolling(query.state.data as CandidateEvaluationData | undefined) ? AI_INTERVIEW_POLL_INTERVAL_MS : false)
      : false,
  });
}
