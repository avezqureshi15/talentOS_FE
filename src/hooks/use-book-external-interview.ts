import { useMutation } from "@tanstack/react-query";
import { bookExternalInterview } from "@/services/interviews/interviews";
import type { BookExternalInterviewPayload } from "@/services/interviews/interviews";

export const useBookExternalInterview = () =>
  useMutation({
    mutationFn: (payload: BookExternalInterviewPayload) => bookExternalInterview(payload),
  });
