import { useMutation } from "@tanstack/react-query";
import { unscheduleAiInterview } from "@/services/ai/ai";

export const useUnscheduleAiInterview = () =>
  useMutation({
    mutationFn: ({ hiringRequestId, candidateId }: { hiringRequestId: string; candidateId: number }) =>
      unscheduleAiInterview(hiringRequestId, candidateId),
  });