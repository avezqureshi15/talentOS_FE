import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRoundDetail } from "@/services/applications/applications";
import { validateForm, submitReview, submitForm } from "@/app/rate-candidate/services/rate-candidate";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import type { FormValidateResponse } from "@/app/rate-candidate/services/rate-candidate.types";
import type { RoundDetailApiResponse } from "@/services/applications/applications.types";
import type { VerdictValue } from "@/app/rate-candidate/components/verdict-buttons/verdict-buttons.types";

type UseRateCandidateResult = {
  formId: string | undefined;
  formLoading: boolean;
  formError: string | null;
  formValid: boolean;
  empId: string | undefined;
  formValidated: boolean;
  roundDetail: RoundDetailApiResponse | undefined;
  roundLoading: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitError: string | null;
  handleSubmitReview: (ratings: Record<string, number>, selectedSkills: string[], review: string, verdict: VerdictValue) => Promise<void>;
};

const REASON_LABELS: Record<string, string> = {
  NOT_FOUND: "This review link was not found.",
  EXPIRED: "This review link has expired.",
  ALREADY_SUBMITTED: "You have already submitted your review for this candidate.",
};

export function useRateCandidate(): UseRateCandidateResult {
  const { reviewFormId: formId } = useParams<{ reviewFormId: string }>();
  const queryClient = useQueryClient();

  const formQuery = useQuery<FormValidateResponse>({
    queryKey: [QUERY_KEYS.APPLICATIONS, "validate", formId],
    queryFn: () => validateForm(formId!),
    enabled: !!formId,
    staleTime: 0,
    retry: false,
  });

  const formLoading = formQuery.isLoading;
  const formValid = formQuery.data?.valid === true;
  const formValidated = formQuery.isFetched;
  const empId = formQuery.data?.emp_id;

  const formError = useMemo(() => {
    if (!formQuery.data || formQuery.data.valid) return null;
    return REASON_LABELS[formQuery.data.reason] ?? formQuery.data.reason;
  }, [formQuery.data]);

  const roundId = formQuery.data?.round_id;

  const roundQuery = useQuery<RoundDetailApiResponse>({
    queryKey: [QUERY_KEYS.ROUND_DETAIL, roundId],
    queryFn: () => fetchRoundDetail(roundId!),
    enabled: formValid && !!roundId,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
  });

  const roundLoading = roundQuery.isLoading;

  const submitMutation = useMutation({
    mutationFn: async (payload: {
      roundId: string;
      reviewData: {
        ratings: Record<string, number>;
        averageRating: number;
        skills: string[];
        notes: string;
      };
      verdict: string;
      formId: string;
    }) => {
      await submitReview(payload.roundId, {
        entity_type: "interviewer",
        reviews: {
          communication: payload.reviewData.ratings.communication ?? 0,
          technical_skills: payload.reviewData.ratings.technical_skills ?? 0,
          problem_solving: payload.reviewData.ratings.problem_solving ?? 0,
          cultural_fit: payload.reviewData.ratings.cultural_fit ?? 0,
          average_rating: payload.reviewData.averageRating,
          skills: payload.reviewData.skills,
          notes: payload.reviewData.notes,
        },
        verdict: payload.verdict,
      });
      await submitForm(payload.formId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROUND_DETAIL, roundId] });
    },
  });

  const handleSubmitReview = useCallback(
    async (ratings: Record<string, number>, selectedSkills: string[], review: string, verdict: VerdictValue) => {
      if (!roundId || !formId || !verdict) return;
      const values = Object.values(ratings).filter(Boolean);
      const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      await submitMutation.mutateAsync({
        roundId,
        reviewData: { ratings, averageRating: avg, skills: selectedSkills, notes: review },
        verdict,
        formId,
      });
    },
    [roundId, formId, submitMutation],
  );

  return {
    formId,
    formLoading,
    formError,
    formValid,
    empId,
    formValidated,
    roundDetail: roundQuery.data,
    roundLoading,
    isSubmitting: submitMutation.isPending,
    isSubmitted: submitMutation.isSuccess,
    submitError: submitMutation.error?.message ?? null,
    handleSubmitReview,
  };
}
