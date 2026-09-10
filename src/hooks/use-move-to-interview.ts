import { useMutation } from "@tanstack/react-query";
import { moveToInterview } from "@/services/ai/ai";
import type { MoveToInterviewPayload } from "@/services/ai/ai.types";

type UseMoveToInterviewArgs = {
  hiringRequestId: string;
  candidateId: number;
};

export const useMoveToInterview = () =>
  useMutation({
    mutationFn: ({ hiringRequestId, candidateId, ...payload }: UseMoveToInterviewArgs & MoveToInterviewPayload) =>
      moveToInterview(hiringRequestId, candidateId, payload),
  });
