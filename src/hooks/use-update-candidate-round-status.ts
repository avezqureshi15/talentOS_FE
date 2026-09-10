import { useMutation } from "@tanstack/react-query";
import { updateCandidateRoundStatus } from "@/services/applications/applications";
import type { UpdateCandidateRoundStatusPayload } from "@/services/applications/applications";

export const useUpdateCandidateRoundStatus = () =>
  useMutation({
    mutationFn: ({ candidateId, ...payload }: { candidateId: number } & UpdateCandidateRoundStatusPayload) =>
      updateCandidateRoundStatus(candidateId, payload),
  });
