import { useMutation } from "@tanstack/react-query";
import { scheduleAiInterview } from "@/services/ai/ai";
import type { AiInterviewSchedulePayload } from "@/services/ai/ai.types";

type UseScheduleAiInterviewArgs = {
  hiringRequestId: string;
  candidateId: number;
};

export const useScheduleAiInterview = () =>
  useMutation({
    mutationFn: ({ hiringRequestId, candidateId, ...payload }: UseScheduleAiInterviewArgs & AiInterviewSchedulePayload) =>
      scheduleAiInterview(hiringRequestId, candidateId, payload),
  });