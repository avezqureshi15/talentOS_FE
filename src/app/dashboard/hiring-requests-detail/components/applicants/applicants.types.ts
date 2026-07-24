import type { ActiveInterview } from "./interview-phase.helpers";

export type { ActiveInterview } from "./interview-phase.helpers";

export type ApplicantStatus =
  | "new"
  | "queued"
  | "processing"
  | "under_evaluation"
  | "shortlisted"
  | "move_to_next_round"
  | "waiting_for_review"
  | "rejected"
  | "scheduled"
  | "interview_scheduled"
  | "interview_rescheduled"
  | "interview_cancelled"
  | "invalid"
  | "failed"
  | "moved_out_of_hiring_pipeline";

export type HiringState =
  | "queued"
  | "processing"
  | "waiting_for_review"
  | "under_evaluation"
  | "shortlisted"
  | "move_to_next_round"
  | "interview_scheduled"
  | "interview_rescheduled"
  | "interview_cancelled"
  | "rejected"
  | "selected"
  | "invalid"
  | "failed";

export type ActionVariant = "shortlist" | "reject" | "screen" | "schedule" | "move";

export type ActionConfig = {
  label: string;
  icon: string;
  variant: ActionVariant;
  handler: string;
};

export type ChipConfig = {
  label: string;
  variant: "success" | "danger" | "warning" | "info" | "neutral" | "yellow";
};

export type MenuAction = "select" | "reject";

export type StateConfig = {
  state: HiringState;
  chip: ChipConfig;
  showInfoChips: boolean;
  showAtsScore: boolean;
  actions: ActionConfig[];
  menuActions: MenuAction[];
  showExpandedContent: boolean;
  footerBadge?: {
    text: string;
    className: string;
  };
};

export type ApplicantCardProps = {
  applicant: Applicant;
  isOpen: boolean;
  isScreening?: boolean;
  readOnly?: boolean;
  accordionTab: AccordionTab;
  onToggleOpen: (id: string) => void;
  onAction?: (handlerKey: string, id: string) => void;
  onMenuAction?: (action: MenuAction, id: string) => void;
  onTabChange: (tab: AccordionTab) => void;
  onTimeline: (id: number) => void;
  onViewRound?: (roundId: string) => void;
  onReschedule?: (applicant: Applicant) => void;
  isRemote?: boolean;
};

export type AiDecision = "shortlisted" | "rejected" | "pending";

export type Applicant = {
  id: string;
  candidateId: number;
  name: string;
  email?: string;
  phone?: string;
  coverLetter?: string;
  aiSummary?: string;
  experienceYears: number;
  currentRole?: string;
  currentCompany?: string;
  linkedinUrl: string;
  cvUrl: string;
  status: ApplicantStatus;
  score?: number;
  aiDecision?: AiDecision;
  appliedAt?: string;
  currentCtc?: string;
  expectedCtc?: string;
  location?: string;
  yearsOfExperience?: string;
  noticePeriod?: string;
  howDidYouHear?: string;
  scheduled?: boolean;
  willingToRelocate?: boolean;
  currentRoundId?: string;
  finalVerdict?: string;
  reviews?: Record<string, unknown>;
  reviewVerdict?: string;
  activeInterview?: ActiveInterview;
};

export type ApplicantsProps = {
  data?: Applicant[];
  openId: string | null;
  setOpenId: (id: string | null) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  scoreFilter?: string;
  onScoreFilterChange?: (value: string) => void;
  rejectReason: string;
  onRejectReasonChange: (value: string) => void;
  applicantParam?: string | null;
  onRefresh?: () => void;
  jdId: string;
  isRemote: boolean;
};

export type AccordionTab = "details" | "cover-letter" | "ai-summary" | "rounds";

export type ApplicantFiltersProps = {
  filter: string;
  onFilterChange: (value: string) => void;
  scoreFilter: string;
  onScoreFilterChange?: (value: string) => void;
  rejectReason: string;
  onRejectReasonChange: (value: string) => void;
};

export type ApplicantActionModalsProps = {
  finalCandidateId: string | null;
  finalDecision: "selected" | "rejected" | null;
  onCloseFinalDecision: () => void;
  confirmFinalDecision: () => void;
  rejectConfirmId: string | null;
  rejectRemarks: string;
  rejectStep: 1 | 2;
  onRejectRemarksChange: (value: string) => void;
  onRejectNextStep: () => void;
  onCloseReject: () => void;
  onConfirmReject: () => void;
  shortlistCandidateId: string | null;
  shortlistRemarks: string;
  onShortlistRemarksChange: (value: string) => void;
  onShortlistMove: () => void;
  onShortlistFinal: () => void;
  onCloseShortlist: () => void;
  finalConfirmId: string | null;
  onConfirmHire: () => void;
  onCloseFinalConfirm: () => void;
  isConfirmingFinalDecision?: boolean;
  isConfirmingReject?: boolean;
  isShortlisting?: boolean;
  shortlistAction?: "move" | "final" | null;
  isConfirmingHire?: boolean;
};

export type CardExpandedContentProps = {
  applicant: Applicant;
  stateConfig: StateConfig;
  accordionTab: AccordionTab;
  onTabChange: (tab: AccordionTab) => void;
  onTimeline: (id: number) => void;
  onViewRound?: (roundId: string) => void;
  isRemote?: boolean;
};
