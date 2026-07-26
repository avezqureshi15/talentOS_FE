import { useMutation } from "@tanstack/react-query";
import { triggerAiInterview } from "@/services/ai/ai";
import type { TriggerInterviewPayload } from "@/services/ai/ai.types";

type UseTriggerAiInterviewArgs = {
  hiringRequestId: string;
  candidateId: number;
} & TriggerInterviewPayload;

export const useTriggerAiInterview = () =>
  useMutation({
    mutationFn: ({ hiringRequestId, candidateId, ...payload }: UseTriggerAiInterviewArgs) =>
      triggerAiInterview(hiringRequestId, candidateId, payload),
  });
