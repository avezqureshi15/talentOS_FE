import { createContext, useContext } from "react";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

export type ApplicationsData = {
  applicants: Applicant[];
  total: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  fetchNext: () => void;
  refresh: () => void;
  interviewCount: number;
  finalizedApplicants: Applicant[];
  finalizedTotal: number;
  finalizedLoading: boolean;
  finalizedRefresh: () => void;
};

export const ApplicationsContext = createContext<ApplicationsData | null>(null);

export const useApplicationsContext = () => {
  const ctx = useContext(ApplicationsContext);
  if (!ctx) throw new Error("useApplicationsContext must be used within ApplicationsProvider");
  return ctx;
};
