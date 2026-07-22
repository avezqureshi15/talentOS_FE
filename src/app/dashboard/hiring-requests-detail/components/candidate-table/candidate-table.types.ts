import type { StageKey } from "@/app/dashboard/hiring-requests-detail/components/pipeline-stages/pipeline-stages.types";

export type Candidate = {
  id: string;
  name: string;
  email?: string;
  addedBy?: string;
  addedAt?: string;
  openingDate?: string;
  deadline?: string;
  startedAt?: string;
  status?: string;
  results?: { score: number; label: string }[];
  partialProgress?: { completed: number; total: number };
  aiProctoring?: "cheating" | "clean";
  lastActivity?: string;
  archivedBy?: string;
  reason?: string;
  archivedAt?: string;
};

export type CandidateTableProps = {
  stage: StageKey;
  data: Candidate[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onRowClick?: (candidate: Candidate) => void;
  subFilter?: string;
};
