import { useMutation } from "@tanstack/react-query";
import { moveToScreening } from "@/services/ai/ai";
import type { MoveToScreeningPayload } from "@/services/ai/ai.types";

type UseMoveToScreeningArgs = {
  hiringRequestId: string;
  candidateId: number;
};

export const useMoveToScreening = () =>
  useMutation({
    mutationFn: ({ hiringRequestId, candidateId, ...payload }: UseMoveToScreeningArgs & MoveToScreeningPayload) =>
      moveToScreening(hiringRequestId, candidateId, payload),
  });
