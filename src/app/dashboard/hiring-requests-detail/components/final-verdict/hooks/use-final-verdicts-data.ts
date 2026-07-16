import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFinalVerdicts } from "@/services/applications/applications";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import { PAGINATION } from "@/constants/api-endpoints";
import type { Applicant, ApplicantStatus } from "../../applicants/applicants.types";
import type { FinalVerdictSubTab } from "../final-verdict.types";

type UseFinalVerdictsResult = {
  candidates: Applicant[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  fetchNext: () => void;
  refresh: () => void;
};

const LIMIT = PAGINATION.APPLICATIONS_PER_PAGE;

export function useFinalVerdictsData(
  subTab: FinalVerdictSubTab,
  jobId: string,
): UseFinalVerdictsResult {
  const candidateStatus = subTab === "selected" ? "selected" : "rejected";

  const query = useInfiniteQuery({
    queryKey: [QUERY_KEYS.FINAL_VERDICTS, candidateStatus, jobId],
    queryFn: ({ pageParam }) =>
      fetchFinalVerdicts(candidateStatus, LIMIT, pageParam as number, jobId),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const nextOffset = (lastPageParam as number) + LIMIT;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      total: data.pages[data.pages.length - 1]?.total ?? 0,
    }),
  });

  const candidates = useMemo<Applicant[]>(
    () =>
      query.data?.pages.flatMap((page) =>
        page.data.map(mapFinalVerdictCandidate),
      ) ?? [],
    [query.data],
  );

  return {
    candidates,
    isLoading: query.isFetching && !query.isFetchingNextPage,
    isLoadingMore: query.isFetchingNextPage,
    hasMore: query.hasNextPage,
    fetchNext: query.fetchNextPage,
    refresh: query.refetch,
  };
}

function mapFinalVerdictCandidate(app: {
  id: string;
  candidate_id: number;
  job_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  cover_letter: string | null;
  resume_url: string | null;
  status: string | null;
  fit_score: number | null;
  summary_md: string | null;
  evaluated_at: string | null;
  current_ctc: string | null;
  expected_ctc: string | null;
  location: string | null;
  years_of_experience: string | null;
  notice_period: string | null;
  how_did_you_hear: string | null;
  linkedin_url: string | null;
  willing_to_relocate?: boolean;
  current_round_id?: string;
  final_verdict?: string;
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
    cvUrl: app.resume_url ?? "",
    status: (app.status as ApplicantStatus) ?? "under_evaluation",
    score: app.fit_score ?? undefined,
    aiDecision: app.fit_score != null
      ? (app.fit_score >= 70 ? "shortlisted" as const : "rejected" as const)
      : "pending" as const,
    currentCtc: app.current_ctc ?? undefined,
    expectedCtc: app.expected_ctc ?? undefined,
    location: app.location ?? undefined,
    yearsOfExperience: app.years_of_experience ?? undefined,
    noticePeriod: app.notice_period ?? undefined,
    howDidYouHear: app.how_did_you_hear ?? undefined,
    willingToRelocate: app.willing_to_relocate ?? undefined,
    currentRoundId: app.current_round_id ?? undefined,
    finalVerdict: app.final_verdict ?? undefined,
  };
}
