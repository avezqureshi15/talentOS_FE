import { useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchApplicationsPaginated, fetchFinalVerdicts } from "@/services/applications/applications";
import { PAGINATION } from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/constants";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

type UseApplicationsDataResult = {
  applicants: Applicant[];
  total: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  fetchNext: () => void;
  refresh: () => void;
};

const LIMIT = PAGINATION.APPLICATIONS_PER_PAGE;

export const useApplicationsData = (
  jobId?: string,
  filter: string = "all",
  enabled: boolean = true,
  pageSize?: number,
  minScore?: number,
  maxScore?: number,
): UseApplicationsDataResult => {
  const limit = pageSize ?? LIMIT;
  const roundVerdict = filter === "all" ? undefined : filter;

  const query = useInfiniteQuery({
    queryKey: [QUERY_KEYS.APPLICATIONS, jobId, roundVerdict, minScore, maxScore, pageSize],
    queryFn: ({ pageParam }) =>
      fetchApplicationsPaginated(
        jobId,
        undefined,
        minScore,
        maxScore,
        undefined,
        undefined,
        limit,
        pageParam as number,
        undefined,
        undefined,
        "false",
        roundVerdict,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const nextOffset = (lastPageParam as number) + limit;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      total: data.pages[data.pages.length - 1]?.total ?? 0,
    }),
  });

  const applicants = useMemo<Applicant[]>(
    () =>
      query.data?.pages.flatMap((page) => page.data.map(mapCandidate)) ?? [],
    [query.data],
  );

  return {
    applicants,
    total: query.data?.total ?? 0,
    isLoading: query.isFetching && !query.isFetchingNextPage,
    isLoadingMore: query.isFetchingNextPage,
    hasMore: query.hasNextPage,
    fetchNext: query.fetchNextPage,
    refresh: query.refetch,
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
}): Applicant {
  return {
    id: app.id,
    candidateId: app.candidate_id,
    name: app.name ?? "",
    email: app.email ?? "",
    phone: app.phone ?? "",
    coverLetter: app.cover_letter ?? "",
    aiSummary: app.summary_md ?? undefined,
    experienceYears: 0,
    currentRole: "",
    currentCompany: "",
    linkedinUrl: app.linkedin_url ?? "",
    scheduled: app.scheduled ?? false,
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
  };
}
