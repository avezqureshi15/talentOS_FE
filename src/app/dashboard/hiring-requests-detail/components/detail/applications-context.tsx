import { createContext, useContext } from "react";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import type { StageKey } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.types";

export type ApplicationsData = {
  applicants: Applicant[];
  total: number;
  isLoading: boolean;
  page: number;
  totalPages: number;
  pageSize: number;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
  refresh: () => void;
  interviewCount: number;
  filter: string;
  scoreFilter: string;
  rejectReason: string;
  setFilter: (value: string) => void;
  setScoreFilter: (value: string) => void;
  setRejectReason: (value: string) => void;
  resetListFilters: () => void;
  activeStage: StageKey;
  setActiveStage: (value: StageKey) => void;
  stageCounts: Record<string, number>;
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
