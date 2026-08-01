import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import {
  getHiringRequestDesign,
  updateHiringRequestDesign,
} from "@/services/questions/questions";
import type {
  InterviewDesign,
  UpdateInterviewDesignPayload,
} from "@/services/questions/questions.types";

export const useInterviewPlanData = (hiringRequestId: string) => {
  const designQuery = useQuery<InterviewDesign>({
    queryKey: [QUERY_KEYS.AI_QUESTIONS, hiringRequestId],
    queryFn: () => getHiringRequestDesign(hiringRequestId),
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    enabled: Boolean(hiringRequestId),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: UpdateInterviewDesignPayload) =>
      updateHiringRequestDesign(hiringRequestId, payload),
  });

  return {
    data: designQuery.data,
    isLoading: designQuery.isLoading,
    error: designQuery.error,
    refetch: designQuery.refetch,
    save: saveMutation,
  };
};
