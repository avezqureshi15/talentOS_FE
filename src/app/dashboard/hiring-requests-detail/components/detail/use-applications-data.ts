import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchApplicationsPaginated, fetchFinalVerdicts } from "@/services/applications/applications";
import type { EvaluatedCandidate } from "@/services/applications/applications.types";
import { PAGINATION } from "@/constants/api-endpoints";
import { AI_SCREENING_POLL_INTERVAL_MS, AI_SCREENING_TERMINAL_STATUSES, QUERY_KEYS } from "@/constants/constants";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

function hasActiveScreeningCall(rows: EvaluatedCandidate[] | undefined): boolean {
  return (
    !!rows &&
    rows.some((row) => {
      const status = row.screening_review?.call_status;
      return !!status && !AI_SCREENING_TERMINAL_STATUSES.has(status.toLowerCase());
    })
  );
}

type UseApplicationsDataResult = {
  applicants: Applicant[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
  isLoading: boolean;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
  refresh: () => void;
  stageCounts: Record<string, number>;
  archivedStageCounts: Record<string, number>;
};

export const useApplicationsData = (
  jobId?: string,
  filter: string = "all",
  enabled: boolean = true,
  minScore?: number,
  maxScore?: number,
  stage?: string,
  rejectReason?: string,
  archived?: boolean,
  excludeFinalized: boolean = true,
): UseApplicationsDataResult => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState<number>(PAGINATION.APPLICATIONS_PER_PAGE);
  const roundVerdict = filter === "all" || filter === "referral" ? undefined : filter;
  const candidateType = filter === "referral" ? "REFERRAL" : undefined;

  const depsKey = `${jobId}|${roundVerdict}|${candidateType}|${minScore}|${maxScore}|${stage}|${pageSize}|${rejectReason}|${archived}|${excludeFinalized}`;
  const [prevDepsKey, setPrevDepsKey] = useState(depsKey);
  if (depsKey !== prevDepsKey) {
    setPrevDepsKey(depsKey);
    setPage(1);
  }

  const offset = (page - 1) * pageSize;

  const query = useQuery({
    queryKey: [QUERY_KEYS.APPLICATIONS, jobId, roundVerdict, candidateType, minScore, maxScore, page, pageSize, stage, rejectReason, archived, excludeFinalized],
    queryFn: () =>
      fetchApplicationsPaginated(
        jobId,
        undefined,
        minScore,
        maxScore,
        undefined,
        undefined,
        pageSize,
        offset,
        undefined,
        undefined,
        excludeFinalized ? "false" : undefined,
        roundVerdict,
        rejectReason,
        stage,
        candidateType,
        archived,
      ),
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    refetchInterval: (q) =>
      hasActiveScreeningCall(q.state.data?.data) ? AI_SCREENING_POLL_INTERVAL_MS : false,
  });

  const total = query.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const goToPage = useCallback(
    (nextPage: number) => {
      setPage(Math.min(Math.max(1, nextPage), totalPages));
    },
    [totalPages],
  );

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
  }, []);

  const applicants = useMemo<Applicant[]>(
    () => query.data?.data.map(mapCandidate) ?? [],
    [query.data],
  );

  return {
    applicants,
    total,
    page,
    totalPages,
    pageSize,
    isLoading: query.isLoading,
    goToPage,
    setPageSize,
    refresh: query.refetch,
    stageCounts: query.data?.stage_counts ?? {},
    archivedStageCounts: query.data?.archived_stage_counts ?? {},
  };
};

type UseFinalizedDataResult = {
  applicants: Applicant[];
  total: number;
  isLoading: boolean;
  refresh: () => void;
};

export const useFinalizedData = (
  jobId?: string,
  enabled: boolean = true,
): UseFinalizedDataResult => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.FINAL_VERDICTS, jobId],
    queryFn: () => fetchFinalVerdicts(undefined, 100, 0, jobId),
    enabled,
    staleTime: 30_000,
  });

  const applicants = useMemo<Applicant[]>(
    () => query.data?.data.map(mapCandidate) ?? [],
    [query.data],
  );

  return {
    applicants,
    total: query.data?.total ?? 0,
    isLoading: query.isFetching,
    refresh: query.refetch,
  };
};

function mapCandidate(app: {
  id: string;
  candidate_id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  candidate_type: string | null;
  cover_letter: string | null;
  resume_url: string | null;
  summary_md: string | null;
  fit_score: number | null;
  current_ctc: string | null;
  expected_ctc: string | null;
  location: string | null;
  years_of_experience: string | null;
  notice_period: string | null;
  how_did_you_hear: string | null;
  linkedin_url: string | null;
  scheduled?: boolean;
  willing_to_relocate?: boolean;
  archived?: boolean;
  current_round_id?: string;
  final_verdict?: string;
  status?: string | null;
  stage?: string | null;
  reviews?: Record<string, unknown> | null;
  review_verdict?: string | null;
  disqualified_by?: string[] | null;
  interview_id?: string | null;
  interviewer_emp_id?: string | null;
  interviewer_name?: string | null;
  round_name?: string | null;
  scheduled_at?: string | null;
  scheduled_end_at?: string | null;
  screening_review?: { call_outcome?: string | null; ended_reason?: string | null; summary?: string | null; flag_reason?: string | null; disposition?: string | null; flagged?: boolean | null; attempt?: number | null; retry_count?: number | null; call_status?: string | null; result?: string | null } | null;
  ai_interview_review?: { flag_reason?: string | null; flagged?: boolean | null; status?: string | null; flagged_at?: string | null } | null;
  attempt?: number | null;
  retry_count?: number | null;
}): Applicant {
  return {
    id: app.id,
    candidateId: app.candidate_id,
    name: app.name ?? "",
    email: app.email ?? "",
    phone: app.phone ?? "",
    candidateType: app.candidate_type ?? undefined,
    coverLetter: app.cover_letter ?? "",
    aiSummary: app.summary_md ?? undefined,
    experienceYears: 0,
    currentRole: "",
    currentCompany: "",
    linkedinUrl: app.linkedin_url ?? "",
    scheduled: app.scheduled ?? false,
    archived: app.archived ?? false,
    cvUrl: app.resume_url ?? "",
    status: (app.status?.toLowerCase() as Applicant["status"]) ?? "new",
    stage: app.stage ?? undefined,
    score: app.fit_score ?? undefined,
    aiDecision: app.fit_score != null ? (app.fit_score >= 70 ? "shortlisted" : "rejected") : "pending",
    currentCtc: app.current_ctc ?? undefined,
    expectedCtc: app.expected_ctc ?? undefined,
    location: app.location ?? undefined,
    yearsOfExperience: app.years_of_experience ?? undefined,
    noticePeriod: app.notice_period ?? undefined,
    howDidYouHear: app.how_did_you_hear ?? undefined,
    willingToRelocate: app.willing_to_relocate ?? undefined,
    currentRoundId: app.current_round_id ?? undefined,
    finalVerdict: app.final_verdict?.toLowerCase().replace(/_/g, "-") ?? undefined,
    reviews: app.reviews ?? undefined,
    reviewVerdict: app.review_verdict ?? undefined,
    disqualifiedBy: app.disqualified_by ?? [],
    interviewId: app.interview_id ?? undefined,
    interviewerEmpId: app.interviewer_emp_id ?? undefined,
    interviewerName: app.interviewer_name ?? undefined,
    roundName: app.round_name ?? undefined,
    scheduledAt: app.scheduled_at ?? undefined,
    scheduledEndAt: app.scheduled_end_at ?? undefined,
    screeningReview: app.screening_review
      ? {
          callOutcome: app.screening_review.call_outcome ?? undefined,
          endedReason: app.screening_review.ended_reason ?? undefined,
          summary: app.screening_review.summary ?? undefined,
          flagReason: app.screening_review.flag_reason ?? undefined,
          disposition: app.screening_review.disposition ?? undefined,
          flagged: app.screening_review.flagged ?? undefined,
          attempt: app.screening_review?.attempt ?? app.screening_review?.retry_count ?? app.attempt ?? app.retry_count ?? undefined,
          retryCount: app.screening_review?.retry_count ?? app.screening_review?.attempt ?? app.retry_count ?? app.attempt ?? undefined,
          callStatus: app.screening_review?.call_status ?? undefined,
          result: app.screening_review?.result ?? undefined,
        }
      : undefined,
    aiInterviewReview: app.ai_interview_review
      ? {
          flagReason: app.ai_interview_review.flag_reason ?? undefined,
          flagged: app.ai_interview_review.flagged ?? undefined,
          status: app.ai_interview_review.status ?? undefined,
          flaggedAt: app.ai_interview_review.flagged_at ?? undefined,
        }
      : undefined,
  };
}
