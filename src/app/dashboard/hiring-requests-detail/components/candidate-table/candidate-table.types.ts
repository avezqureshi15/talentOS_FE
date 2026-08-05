import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import type { StageColumn } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.types";

export type Candidate = Applicant;

export type CandidateTableProps = {
  data: Applicant[];
  columns: StageColumn[];
  onRowClick?: (candidate: Applicant) => void;
  onInfoClick?: (candidate: Applicant) => void;
  /** Optional. When provided, adds "Schedule Round" to the actions menu for
   * candidates whose status is eligible (currently "move_to_next_round"). */
  onScheduleClick?: (candidate: Applicant) => void;
  onTimelineOpen?: (candidate: Applicant) => void;
  showBulkSelection?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
  allSelected?: boolean;
  activeStage?: string;
  loading?: boolean;
};
