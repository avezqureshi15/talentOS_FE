import { useMutation } from "@tanstack/react-query";
import { bookInterview } from "@/services/interviews/interviews";
import type { BookInterviewPayload } from "@/services/interviews/interviews";

export const useBookInterview = () =>
  useMutation({
    mutationFn: (payload: BookInterviewPayload) => bookInterview(payload),
  });
