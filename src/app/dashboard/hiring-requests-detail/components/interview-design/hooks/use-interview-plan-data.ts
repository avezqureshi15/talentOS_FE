import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import { queryClient } from "@/services/query-client";
import {
  getHiringRequestDesign,
  generateHiringRequestDesignQuestions,
  updateHiringRequestDesign,
} from "@/services/questions/questions";
import type {
  DesignQuestionKind,
  InterviewDesign,
  UpdateInterviewDesignPayload,
} from "@/services/questions/questions.types";

// The three kinds, generated in this order — screening/interview questions
// are what a scheduler needs first (they gate moving a candidate forward),
// review questions matter once an interview has actually happened.
const AUTO_GENERATE_KIND_ORDER: DesignQuestionKind[] = ["screening", "interview", "review"];

const sectionsFor = (design: InterviewDesign, kind: DesignQuestionKind) => {
  if (kind === "screening") return design.screening_sections;
  if (kind === "interview") return design.interview_sections;
  return design.review_sections;
};

const hasAnyQuestions = (design: InterviewDesign, kind: DesignQuestionKind): boolean =>
  sectionsFor(design, kind).some((section) => section.questions.length > 0);

// Trust the flag, but never let it get a kind stuck: a kind whose flag says
// "generated" but which actually has zero questions (e.g. an already-linked
// ai-recruitment-poc job with no interview questions saved on it — see
// get_or_seed_design) is still treated as needing generation, so it isn't
// silently left empty forever.
const isKindGenerated = (design: InterviewDesign, kind: DesignQuestionKind): boolean => {
  const flag =
    kind === "screening" ? design.screening_ai_generated
    : kind === "interview" ? design.interview_ai_generated
    : design.review_ai_generated;
  return flag && hasAnyQuestions(design, kind);
};

/**
 * Loads a hiring request's interview design and, once loaded, auto-fills
 * with AI-generated questions any kind (screening/interview/review) that
 * doesn't have real content yet — so the job owner arrives to a fully
 * pre-filled interview ready to edit, instead of an empty one they have to
 * generate by hand. Runs at most once per hiring request per mount, and
 * never touches a kind that's already been generated (or edited) before —
 * see InterviewDesign.*_ai_generated server-side.
 *
 * `autoGenerateEnabled` should reflect whether the current user actually has
 * permission to trigger generation (PERMISSIONS.INTERVIEW_PLAN_EDIT) — a
 * viewer merely opening the page shouldn't kick off AI calls on the backend.
 */
export const useInterviewPlanData = (hiringRequestId: string, autoGenerateEnabled: boolean) => {
  const designQuery = useQuery<InterviewDesign>({
    queryKey: [QUERY_KEYS.AI_QUESTIONS, hiringRequestId],
    queryFn: () => getHiringRequestDesign(hiringRequestId),
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    enabled: Boolean(hiringRequestId),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: UpdateInterviewDesignPayload) =>
      updateHiringRequestDesign(hiringRequestId, payload),
  });

  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [autoGeneratingKind, setAutoGeneratingKind] = useState<DesignQuestionKind | null>(null);
  const triggeredForRef = useRef<string | null>(null);

  const { data, isSuccess } = designQuery;

  useEffect(() => {
    // Deliberately keyed on `isSuccess` (flips false->true exactly once per
    // successful load), not on `data` itself — `data` also changes on every
    // setQueryData call this same effect makes below as each kind finishes,
    // which would otherwise re-run this effect and cancel its own loop
    // after just one kind. `data` is still read fresh at that single
    // isSuccess transition via closure, which is all this needs.
    if (!autoGenerateEnabled || !isSuccess || !data || !hiringRequestId) return;
    if (triggeredForRef.current === hiringRequestId) return;
    triggeredForRef.current = hiringRequestId;

    const missingKinds = AUTO_GENERATE_KIND_ORDER.filter((kind) => !isKindGenerated(data, kind));
    if (missingKinds.length === 0) return;

    let cancelled = false;

    (async () => {
      setIsAutoGenerating(true);
      for (const kind of missingKinds) {
        if (cancelled) break;
        setAutoGeneratingKind(kind);
        try {
          const updated = await generateHiringRequestDesignQuestions(hiringRequestId, { kind });
          if (!cancelled) {
            queryClient.setQueryData([QUERY_KEYS.AI_QUESTIONS, hiringRequestId], updated);
          }
        } catch {
          // Best-effort prefill: this kind stays *_ai_generated=false
          // server-side, so it's simply retried the next time this page
          // loads — no error surfaced here, the manual "Generate" button in
          // edit mode is still there as a fallback.
        }
      }
      if (!cancelled) {
        setIsAutoGenerating(false);
        setAutoGeneratingKind(null);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see comment above: `data` is read fresh via closure at the isSuccess transition, and must NOT be a dep (this effect writes to `data` itself mid-run)
  }, [autoGenerateEnabled, isSuccess, hiringRequestId]);

  return {
    data: designQuery.data,
    isLoading: designQuery.isLoading,
    error: designQuery.error,
    refetch: designQuery.refetch,
    save: saveMutation,
    isAutoGenerating,
    autoGeneratingKind,
  };
};
