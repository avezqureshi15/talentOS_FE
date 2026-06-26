import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchApplicationsPaginated } from "@/services/applications/applications";
import { PAGINATION } from "@/constants/api-endpoints";
import { QUERY_KEYS, MOCK_ROUNDS } from "@/constants/constants";
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
  jobId: string,
  filter: string,
  enabled: boolean,
  minScore?: number,
  maxScore?: number,
): UseApplicationsDataResult => {
  const status = filter.toUpperCase().replace("-", "_");

  const query = useInfiniteQuery({
    queryKey: [QUERY_KEYS.APPLICATIONS, jobId, status, minScore, maxScore],
    queryFn: ({ pageParam }) =>
      fetchApplicationsPaginated(
        jobId,
        status === "ALL" ? undefined : status,
        minScore,
        maxScore,
        LIMIT,
        pageParam as number,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const nextOffset = (lastPageParam as number) + LIMIT;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    enabled,
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

function mapCandidate(app: {
  id: string;
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
}): Applicant {
  return {
    id: app.id,
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
    status: "new",
    score: app.fit_score ?? undefined,
    currentCtc: app.current_ctc ?? undefined,
    expectedCtc: app.expected_ctc ?? undefined,
    location: app.location ?? undefined,
    yearsOfExperience: app.years_of_experience ?? undefined,
    noticePeriod: app.notice_period ?? undefined,
    howDidYouHear: app.how_did_you_hear ?? undefined,
    rounds: MOCK_ROUNDS,
  };
}
