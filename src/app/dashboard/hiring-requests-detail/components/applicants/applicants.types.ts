import type { Permission } from "@/constants/permissions";

export type ApplicantStatus = "new" | "under_evaluation" | "shortlisted" | "resume_shortlisted" | "move_to_next_round" | "waiting_for_review" | "rejected" | "scheduled" | "interview_scheduled" | "interview_rescheduled" | "interview_cancelled" | "SCREENING_ROUND_SCHEDULED" | "screening_round_scheduled" | "AI_SCREENING_EVALUATION_FAILED" | "ai_screening_evaluation_failed" | "AI_SCREENING_FLAGGED" | "ai_screening_flagged";

export type HiringState =
  | "waiting_for_review"
  | "under_evaluation"
  | "shortlisted"
  | "move_to_next_round"
  | "interview_scheduled"
  | "interview_rescheduled"
  | "interview_cancelled"
  | "screening_round_scheduled"
  | "ai_screening_evaluation_failed"
  | "ai_screening_flagged"
  | "rejected"
  | "selected"
  | "on-hold";

export type ActionVariant = "shortlist" | "reject" | "screen" | "schedule" | "move" | "cancel" | "reschedule" | "call";

export type ActionConfig = {
  label: string;
  icon: string;
  variant: ActionVariant;
  handler: string;
  permission?: Permission;
};

export type ChipConfig = {
  label: string;
  variant: "success" | "danger" | "warning" | "info" | "neutral" | "yellow";
};

export type MenuAction = "select" | "reject" | "hold";

export type StateConfig = {
  state: HiringState;
  chip?: ChipConfig;
  showInfoChips: boolean;
  actions: ActionConfig[];
  menuActions: MenuAction[];
  showExpandedContent: boolean;
  footerBadge?: {
    text: string;
    className: string;
  isConfirmingFinalDecision?: boolean;
  isConfirmingReject?: boolean;
  isShortlisting?: boolean;
  isConfirmingHire?: boolean;
};
};

export type ApplicantCardProps = {
  applicant: Applicant;
  isOpen: boolean;
  isScreening?: boolean;
  readOnly?: boolean;
  isSelected?: boolean;
  showCheckbox?: boolean;
  accordionTab: AccordionTab;
  onToggleOpen: (id: string) => void;
  onAction?: (handlerKey: string, id: string) => void;
  onMenuAction?: (action: MenuAction, id: string) => void;
  onToggleSelect?: (id: string) => void;
  onTabChange: (tab: AccordionTab) => void;
  onCoverLetterReadMore: (id: string) => void;
  onAiSummaryReadMore: (id: string) => void;
  onDetailsReadMore: (id: string) => void;
  onTimeline: (id: number) => void;
  onViewRound?: (id: string) => void;
  jdId?: string;
  isRemote?: boolean;
};

export type AiDecision = "shortlisted" | "rejected" | "pending";

export type Applicant = {
  id: string;
  candidateId: number;
  name: string;
  email?: string;
  phone?: string;
  candidateType?: string;
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
  archived?: boolean;
  currentRoundId?: string;
  finalVerdict?: string;
  reviews?: Record<string, unknown>;
  reviewVerdict?: string;
  stage?: string;
  disqualifiedBy?: string[];
  interviewId?: string;
  interviewerEmpId?: string;
  interviewerName?: string;
  roundName?: string;
  scheduledAt?: string;
  scheduledEndAt?: string;
  screeningReview?: {
    callOutcome?: string;
    endedReason?: string;
    summary?: string;
    flagReason?: string;
    disposition?: string;
    flagged?: boolean;
    retryCount?: number;
    callStatus?: string;
    attempt?: number;
  };
};

export type ApplicantsProps = {
  data?: Applicant[];
  openId: string | null;
  setOpenId: (id: string | null) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  scoreFilter?: string;
  onScoreFilterChange?: (value: string) => void;
  rejectReason: string;
  onRejectReasonChange: (value: string) => void;
  applicantParam?: string | null;
  onRefresh?: () => void;
  jdId: string;
  isRemote: boolean;
  showBulkSelection?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
  allSelected?: boolean;
  selectionCount?: number;
  timelineId: number | null;
  onTimeline: (id: number) => void;
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
  data: Applicant[];
  finalCandidateId: string | null;
  finalDecision: "selected" | "on-hold" | "rejected" | null;
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
  shortlistStep: 1 | 2;
  shortlistRemarks: string;
  onShortlistRemarksChange: (value: string) => void;
  onShortlistOk: () => void;
  onMoveToNextRound: () => void;
  onOpenFinalSelectionWarning: () => void;
  onCloseShortlist: () => void;
  finalConfirmId: string | null;
  onFinalConfirmAction: (decision: "selected" | "rejected" | "on-hold") => void;
  onCloseFinalConfirm: () => void;
  isConfirmingFinalDecision?: boolean;
  isConfirmingReject?: boolean;
  isShortlisting?: boolean;
  isConfirmingHire?: boolean;
};

export type CardExpandedContentProps = {
  applicant: Applicant;
  stateConfig: StateConfig;
  accordionTab: AccordionTab;
  onTabChange: (tab: AccordionTab) => void;
  onTimeline: (id: number) => void;
  onDetailsReadMore: (id: string) => void;
  onCoverLetterReadMore: (id: string) => void;
  onAiSummaryReadMore: (id: string) => void;
  jdId?: string;
  isRemote?: boolean;
};
