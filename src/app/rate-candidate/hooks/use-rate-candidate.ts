import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { validateForm, submitReview, submitForm, fetchRoundDetailPublic } from "@/app/rate-candidate/services/rate-candidate";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import type {
  AnswerMap,
  FormValidateResponse,
  ReviewPhase,
  ReviewQuestionsPayload,
} from "@/app/rate-candidate/services/rate-candidate.types";
import type { RoundDetailApiResponse } from "@/services/applications/applications.types";
import type { VerdictValue } from "@/app/rate-candidate/components/verdict-buttons/verdict-buttons.types";
import {
  STATIC_REVIEW_QUESTIONS,
  buildInterviewerReviewsPayload,
} from "@/app/rate-candidate/components/rating-panel/rating-panel.helpers";

type UseRateCandidateResult = {
  formId: string | undefined;
  formLoading: boolean;
  formError: string | null;
  formValid: boolean;
  empId: string | undefined;
  formValidated: boolean;
  resolvedQuestions: ReviewQuestionsPayload | null;
  roundDetail: RoundDetailApiResponse | undefined;
  roundLoading: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitError: string | null;
  handleSubmitReview: (
    phases: ReviewPhase[],
    questionsSource: string,
    answers: AnswerMap,
    selectedSkills: string[],
    verdict: VerdictValue,
  ) => Promise<void>;
};

const REASON_LABELS: Record<string, string> = {
  NOT_FOUND: "This review link was not found.",
  EXPIRED: "This review link has expired.",
  ALREADY_SUBMITTED: "You have already submitted your review for this candidate.",
};

function resolveReviewQuestions(
  reviewQuestions: ReviewQuestionsPayload | null | undefined,
): ReviewQuestionsPayload {
  if (reviewQuestions?.phases?.some((p) => p.questions?.length)) {
    const phases = reviewQuestions.phases
      .map((p) => ({
        phase: (p.phase || "").trim(),
        questions: (p.questions ?? []).map((q) => q.trim()).filter(Boolean),
      }))
      .filter((p) => p.phase && p.questions.length > 0);
    if (phases.length > 0) {
      return {
        questions_source: reviewQuestions.questions_source || "static",
        phases,
      };
    }
  }
  return {
    questions_source: STATIC_REVIEW_QUESTIONS.questions_source,
    phases: STATIC_REVIEW_QUESTIONS.phases.map((p) => ({
      phase: p.phase,
      questions: [...p.questions],
    })),
  };
}

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

  const resolvedQuestions = useMemo(() => {
    if (!formValid) return null;
    return resolveReviewQuestions(formQuery.data?.review_questions);
  }, [formValid, formQuery.data?.review_questions]);

  const roundQuery = useQuery<RoundDetailApiResponse>({
    queryKey: [QUERY_KEYS.ROUND_DETAIL, roundId],
    queryFn: () => fetchRoundDetailPublic(roundId!),
    enabled: formValid && !!roundId,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
  });

  const roundLoading = roundQuery.isLoading;

  const submitMutation = useMutation({
    mutationFn: async (payload: {
      roundId: string;
      formId: string;
      entity_type: string;
      reviews: ReturnType<typeof buildInterviewerReviewsPayload>;
      verdict: string;
    }) => {
      await submitReview(payload.roundId, {
        entity_type: payload.entity_type,
        reviews: payload.reviews,
        verdict: payload.verdict,
      });
      await submitForm(payload.formId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROUND_DETAIL, roundId] });
    },
  });

  const handleSubmitReview = useCallback(
    async (
      phases: ReviewPhase[],
      questionsSource: string,
      answers: AnswerMap,
      selectedSkills: string[],
      verdict: VerdictValue,
    ) => {
      if (!roundId || !formId || !verdict) return;
      await submitMutation.mutateAsync({
        roundId,
        formId,
        entity_type: "interviewer",
        reviews: buildInterviewerReviewsPayload(questionsSource, phases, answers, selectedSkills),
        verdict,
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
    resolvedQuestions,
    roundDetail: roundQuery.data,
    roundLoading,
    isSubmitting: submitMutation.isPending,
    isSubmitted: submitMutation.isSuccess,
    submitError: submitMutation.error?.message ?? null,
    handleSubmitReview,
  };
}
