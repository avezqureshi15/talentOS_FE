import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelInterview } from "@/services/interviews/interviews";
import { QUERY_KEYS } from "@/constants/constants";

export const useCancelInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (interviewId: string) => cancelInterview(interviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INTERVIEWS] });
    },
  });
};