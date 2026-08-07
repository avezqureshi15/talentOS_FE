import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

type UseJobDetailOptions = {
  applicantParam: string | null;
  applicants: Applicant[];
  appsLoading: boolean;
  page: number;
  totalPages: number;
  goToPage: (page: number) => void;
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
  applicantNotFound: boolean;
};

export function useJobDetail({
  applicantParam,
  applicants,
  appsLoading,
  page,
  totalPages,
  goToPage,
  jobId,
}: UseJobDetailOptions): UseJobDetailReturn {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"table" | "card">(
    (searchParams.get("view") as "table" | "card") ?? "table"
  );
  const [openId, setOpenId] = useState<string | null>(applicantParam ?? null);
  const scrollAttemptedRef = useRef(false);
  const [searchStatus, setSearchStatus] = useState<"idle" | "searching" | "not-found">(
    applicantParam ? "searching" : "idle",
  );
  const [prevApplicantParam, setPrevApplicantParam] = useState<string | null>(applicantParam);
  if (applicantParam !== prevApplicantParam) {
    setPrevApplicantParam(applicantParam);
    setSearchStatus(applicantParam ? "searching" : "idle");
  }

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
      if (appsLoading) return;

      const found = applicants.some((a) => a.id === applicantParam);

      if (found) {
        scrollAttemptedRef.current = true;
        setSearchStatus("idle");
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

      if (page < totalPages) {
        setSearchStatus("searching");
        goToPage(page + 1);
      } else {
        setSearchStatus("not-found");
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
    [applicantParam, appsLoading, applicants, page, totalPages, goToPage, setSearchParams, setOpenId],
  );

  const handleRowClick = useCallback(
    (candidate: Applicant) => {
      if (candidate.status === "interview_scheduled" || candidate.status === "interview_rescheduled" || candidate.status === "interview_cancelled" || candidate.status === "screening_round_scheduled" || candidate.status === "ongoing") return;
      const roundId = candidate.currentRoundId ?? candidate.id;
      window.open(`/hiring-requests/${jobId}/round-details/${roundId}?candidateId=${candidate.id}`, "_blank");
    },
    [jobId],
  );

  const handleInfoClick = useCallback(
    (candidate: Applicant) => {
      scrollAttemptedRef.current = false;
      setSearchStatus("searching");
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
    isSearchingForApplicant: searchStatus === "searching",
    applicantNotFound: searchStatus === "not-found",
  };
}
