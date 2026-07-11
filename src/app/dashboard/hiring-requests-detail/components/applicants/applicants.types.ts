export type ApplicantStatus =
  | "new" | "reviewing" | "shortlisted" | "rejected" | "hired";

export type InterviewRound = {
  id: string;
  round: string;
  interviewer: string;
  role: string;
  jdHref: string;
  jdLabel: string;
  candidate: string;
  occurredOn: string;
  slot: string;
  duration: string;
  interviewType: string;
  status: string;
  ratings: { label: string; score: number; maxScore: number }[];
  skills: string[];
  notes: string;
  aiSummary: string;
  verdict: "reject" | "hold" | "advance";
  aiDecision: "pending" | "selected" | "rejected" | "conflict";
  hrDecision: "pending" | "approved" | "rejected";
};

export type ApplicantCardProps = {
  applicant: Applicant;
  isOpen: boolean;
  isScreening: boolean;
  accordionTab: AccordionTab;
  onToggleOpen: (id: string) => void;
  onStartScreening: (id: string) => void;
  onHrShortlist: (id: string) => void;
  onHrReject: (id: string) => void;
  onTabChange: (tab: AccordionTab) => void;
  onCoverLetterReadMore: (id: string) => void;
  onAiSummaryReadMore: (id: string) => void;
  onDetailsReadMore: (id: string) => void;
  onTimeline: (id: string) => void;
  onScheduleRound1: (id: string) => void;
  onFinalDecision: (id: string, decision: "selected" | "rejected") => void;
  onViewRound?: (round: InterviewRound) => void;
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
  rounds?: InterviewRound[];
};

export type ApplicantsProps = {
  data: Applicant[];
  openId: string | null;
  setOpenId: (id: string | null) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  scoreFilter?: string;
  onScoreFilterChange?: (value: string) => void;
  applicantParam?: string | null;
};

export type AccordionTab = "details" | "cover-letter" | "ai-summary" | "rounds";

export type ApplicantFiltersProps = {
  filter: string;
  onFilterChange: (value: string) => void;
  scoreFilter: string;
  onScoreFilterChange?: (value: string) => void;
};

export type ApplicantActionModalsProps = {
  data: Applicant[];
  finalCandidateId: string | null;
  finalDecision: "selected" | "rejected" | null;
  onCloseFinalDecision: () => void;
  confirmFinalDecision: () => void;
  rejectConfirmId: string | null;
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
  onConfirmHire: () => void;
  onCloseFinalConfirm: () => void;
};

export type CardExpandedContentProps = {
  applicant: Applicant;
  accordionTab: AccordionTab;
  onTabChange: (tab: AccordionTab) => void;
  onTimeline: (id: string) => void;
  onDetailsReadMore: (id: string) => void;
  onCoverLetterReadMore: (id: string) => void;
  onAiSummaryReadMore: (id: string) => void;
  onViewRound?: (round: InterviewRound) => void;
};
