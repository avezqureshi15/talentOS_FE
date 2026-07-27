import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

type UseJobDetailOptions = {
  applicantParam: string | null;
  applicants: Applicant[];
  appsLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  fetchNext: () => void;
  jobId: string;
};

type UseJobDetailReturn = {
  viewMode: "table" | "card";
  setViewMode: (v: "table" | "card") => void;
  openId: string | null;
  setOpenId: (v: string | null) => void;
  handleRowClick: (candidate: Applicant) => void;
  handleInfoClick: (candidate: Applicant) => void;
  isSearchingForApplicant: boolean;
};

export function useJobDetail({
  applicantParam,
  applicants,
  appsLoading,
  isLoadingMore,
  hasMore,
  fetchNext,
  jobId,
}: UseJobDetailOptions): UseJobDetailReturn {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"table" | "card">(
    (searchParams.get("view") as "table" | "card") ?? "table"
  );
  const [openId, setOpenId] = useState<string | null>(applicantParam ?? null);
  const scrollAttemptedRef = useRef(false);
  const [isSearchingForApplicant, setIsSearchingForApplicant] = useState(false);

  useEffect(
    () => {
      const view = searchParams.get("view");
      if (view === "card" || view === "table") setViewMode(view);
      const app = searchParams.get("applicant");
      if (app) setOpenId(app);
    },
    // Sync URL search params into local state when they change
    [searchParams],
  );

  useEffect(
    () => {
      if (!applicantParam || scrollAttemptedRef.current) return;
      if (appsLoading || isLoadingMore) return;

      const found = applicants.some((a) => a.id === applicantParam);

      if (found) {
        scrollAttemptedRef.current = true;
        setIsSearchingForApplicant(false);
        setOpenId(applicantParam);

        const scrollTimer = setTimeout(() => {
          const el = document.querySelector(`[data-applicant-id="${applicantParam}"]`);
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);

        const clearTimer = setTimeout(() => {
          setSearchParams((prev) => {
            prev.delete("applicant");
            prev.delete("view");
            return prev;
          });
        }, 3000);

        return () => {
          clearTimeout(scrollTimer);
          clearTimeout(clearTimer);
        };
      }

      if (hasMore) {
        setIsSearchingForApplicant(true);
        fetchNext();
      } else {
        setIsSearchingForApplicant(false);
        scrollAttemptedRef.current = true;
        const clearTimer = setTimeout(() => {
          setSearchParams((prev) => {
            prev.delete("applicant");
            prev.delete("view");
            return prev;
          });
        }, 4000);
        return () => clearTimeout(clearTimer);
      }
    },
    // Scroll to a candidate when applicantParam is present in URL
    [applicantParam, appsLoading, isLoadingMore, applicants, hasMore, fetchNext, setSearchParams, setOpenId],
  );

  const handleRowClick = useCallback(
    (candidate: Applicant) => {
      if (candidate.status === "interview_scheduled" || candidate.status === "interview_rescheduled" || candidate.status === "interview_cancelled" || candidate.status === "screening_round_scheduled") return;
      const roundId = candidate.currentRoundId ?? candidate.id;
      window.open(`/hiring-requests/${jobId}/round-details/${roundId}?candidateId=${candidate.id}`, "_blank");
    },
    [jobId],
  );

  const handleInfoClick = useCallback(
    (candidate: Applicant) => {
      setSearchParams({ applicant: candidate.id, view: "card" });
    },
    [setSearchParams],
  );

  return {
    viewMode,
    setViewMode,
    openId,
    setOpenId,
    handleRowClick,
    handleInfoClick,
    isSearchingForApplicant,
  };
}
