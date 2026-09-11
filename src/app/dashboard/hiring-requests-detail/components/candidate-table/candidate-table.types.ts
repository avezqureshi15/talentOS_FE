import type { Applicant, MenuAction } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import type { StageColumn } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.types";

export type Candidate = Applicant;

export type CandidateTableProps = {
  data: Applicant[];
  columns: StageColumn[];
  onRowClick?: (candidate: Applicant) => void;
  onAction?: (handlerKey: string, candidateId: string) => void;
  onMenuAction?: (action: MenuAction, candidateId: string) => void;
  onEditDetails?: (candidate: Applicant) => void;
  onTimelineOpen?: (candidate: Applicant) => void;
  showBulkSelection?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
  allSelected?: boolean;
  activeStage?: string;
  loading?: boolean;
  hiringRequestId?: string;
  onScreeningTriggered?: () => void;
  expandedId?: string | null;
  isRemote?: boolean;
};
