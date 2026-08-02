import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/constants";
import { retryAiScreening, retryAiInterview, fetchAiInterviewRecordingUrl } from "@/services/ai/ai";
import { useToast } from "@/hooks/use-toast";
import type { AiRetryResponse } from "@/services/ai/ai.types";

type RetryArgs = {
  hiringRequestId: string;
  candidateId: number;
};

function useRetryBase(kind: "screening" | "interview") {
  const { success, error } = useToast();
  const queryClient = useQueryClient();
  const fn = kind === "screening" ? retryAiScreening : retryAiInterview;

  return useMutation<AiRetryResponse, Error, RetryArgs>({
    mutationFn: ({ hiringRequestId, candidateId }) => fn(hiringRequestId, candidateId),
    onSuccess: (data, { hiringRequestId, candidateId }) => {
      const queryKey =
        kind === "screening"
          ? [QUERY_KEYS.AI_SCREENING, hiringRequestId, candidateId]
          : [QUERY_KEYS.AI_INTERVIEWS, hiringRequestId, candidateId];
      queryClient.invalidateQueries({ queryKey });
      if (data.missing_fields.length > 0) {
        success(
          `AI ${kind} result synced, but ${data.missing_fields.length} field(s) are still missing in the source.`,
          "Synced with gaps",
        );
      } else {
        success(`AI ${kind} result re-fetched and saved.`, "Retry complete");
      }
    },
    onError: (err) => {
      error(err.message || `Failed to retry AI ${kind}.`, "Retry failed");
    },
  });
}

export function useAiRetryScreening() {
  return useRetryBase("screening");
}

export function useAiRetryInterview() {
  return useRetryBase("interview");
}

export function useAiInterviewRecording() {
  const { success, error, warning } = useToast();

  return useMutation<{ recording_url: string | null }, Error, RetryArgs & { interviewId: string }>({
    mutationFn: ({ hiringRequestId, candidateId, interviewId }) =>
      fetchAiInterviewRecordingUrl(hiringRequestId, candidateId, interviewId),
    onSuccess: (data) => {
      if (data.recording_url) {
        window.open(data.recording_url, "_blank", "noopener,noreferrer");
        success("Opening interview recording.", "Recording ready");
      } else {
        warning(
          "The recording is not ready yet. It becomes available shortly after the interview uploads.",
          "Recording not ready",
        );
      }
    },
    onError: (err) => {
      error(err.message || "Failed to fetch the interview recording.", "Recording unavailable");
    },
  });
}
