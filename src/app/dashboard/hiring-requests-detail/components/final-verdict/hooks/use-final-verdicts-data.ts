import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFinalVerdicts } from "@/services/applications/applications";
import type { EvaluatedCandidate } from "@/services/applications/applications.types";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import { PAGINATION } from "@/constants/api-endpoints";
import type { Applicant, ApplicantStatus } from "../../applicants/applicants.types";
import { FINAL_VERDICT_API_STATUS } from "../final-verdict.constants";
import type { FinalVerdictSubTab } from "../final-verdict.types";

type UseFinalVerdictsResult = {
  candidates: Applicant[];
  isLoading: boolean;
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
  refresh: () => void;
};

export function useFinalVerdictsData(
  subTab: FinalVerdictSubTab,
  jobId: string,
): UseFinalVerdictsResult {
  const candidateStatus = FINAL_VERDICT_API_STATUS[subTab];
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState<number>(PAGINATION.APPLICATIONS_PER_PAGE);

  const depsKey = `${jobId}|${candidateStatus}|${pageSize}`;
  const [prevDepsKey, setPrevDepsKey] = useState(depsKey);
  if (depsKey !== prevDepsKey) {
    setPrevDepsKey(depsKey);
    setPage(1);
  }

  const offset = (page - 1) * pageSize;

  const query = useQuery({
    queryKey: [QUERY_KEYS.FINAL_VERDICTS, candidateStatus, jobId, page, pageSize],
    queryFn: () => fetchFinalVerdicts(candidateStatus, pageSize, offset, jobId),
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    refetchOnWindowFocus: false,
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

  const candidates = useMemo<Applicant[]>(
    () => query.data?.data.map((app) => mapFinalVerdictCandidate(app, subTab)) ?? [],
    [query.data, subTab],
  );

  return {
    candidates,
    isLoading: query.isLoading,
    total,
    page,
    totalPages,
    pageSize,
    goToPage,
    setPageSize,
    refresh: query.refetch,
  };
}

function mapFinalVerdictCandidate(app: EvaluatedCandidate, subTab: FinalVerdictSubTab): Applicant {
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
    finalVerdict: app.final_verdict?.toLowerCase().replace(/_/g, "-") ?? subTab,
  };
}
