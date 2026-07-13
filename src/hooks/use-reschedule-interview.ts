import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rescheduleInterview } from "@/services/interviews/interviews";
import { QUERY_KEYS } from "@/constants/constants";
import type { RescheduleInterviewPayload } from "@/services/interviews/interviews";

export const useRescheduleInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ interviewId, ...payload }: { interviewId: string } & RescheduleInterviewPayload) =>
      rescheduleInterview(interviewId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INTERVIEWS] });
    },
  });
};