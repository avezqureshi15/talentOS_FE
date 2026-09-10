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
  onExpand: (id: string) => void;
};

type UseJobDetailReturn = {
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
  onExpand,
}: UseJobDetailOptions): UseJobDetailReturn {
  const [, setSearchParams] = useSearchParams();
  const scrollAttemptedRef = useRef(false);
  const [searchStatus, setSearchStatus] = useState<"idle" | "searching" | "not-found">(
    applicantParam ? "searching" : "idle",
  );
  const [prevApplicantParam, setPrevApplicantParam] = useState<string | null>(applicantParam);
  if (applicantParam !== prevApplicantParam) {
    setPrevApplicantParam(applicantParam);
    scrollAttemptedRef.current = false;
    setSearchStatus(applicantParam ? "searching" : "idle");
  }

  const clearApplicantParams = useCallback(() => {
    setSearchParams((prev) => {
      prev.delete("applicant");
      prev.delete("view");
      return prev;
    });
  }, [setSearchParams]);

  useEffect(
    () => {
      if (!applicantParam || scrollAttemptedRef.current) return;
      if (appsLoading) return;

      const match = applicants.find(
        (a) => a.id === applicantParam || String(a.candidateId) === applicantParam,
      );

      if (match) {
        scrollAttemptedRef.current = true;
        setSearchStatus("idle");
        onExpand(match.id);
        clearApplicantParams();
        return;
      }

      if (page < totalPages) {
        setSearchStatus("searching");
        goToPage(page + 1);
      } else {
        setSearchStatus("not-found");
        scrollAttemptedRef.current = true;
        const clearTimer = setTimeout(() => {
          clearApplicantParams();
        }, 4000);
        return () => clearTimeout(clearTimer);
      }
    },
    [applicantParam, appsLoading, applicants, page, totalPages, goToPage, onExpand, clearApplicantParams],
  );

  return {
    isSearchingForApplicant: searchStatus === "searching",
    applicantNotFound: searchStatus === "not-found",
  };
}
