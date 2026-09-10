import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { generateHiringRequestDesignQuestions } from "@/services/questions/questions";
import type {
  DesignQuestionKind,
  InterviewDesign,
} from "@/services/questions/questions.types";

const GENERATE_ERROR_FALLBACK = "AI generation failed. Please retry.";

const extractErrorDetail = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { detail?: unknown } | undefined;
    if (typeof data?.detail === "string" && data.detail) {
      return data.detail;
    }
  }
  return GENERATE_ERROR_FALLBACK;
};

export const useGenerateQuestions = (hiringRequestId: string) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation<InterviewDesign, unknown, { kind: DesignQuestionKind }>({
    mutationFn: ({ kind }) =>
      generateHiringRequestDesignQuestions(hiringRequestId, { kind }),
    onSuccess: () => setErrorMessage(null),
    onError: (error) => setErrorMessage(extractErrorDetail(error)),
  });

  return {
    generate: (kind: DesignQuestionKind) => mutation.mutateAsync({ kind }),
    isPending: mutation.isPending,
    errorMessage,
    clearError: () => setErrorMessage(null),
  };
};
