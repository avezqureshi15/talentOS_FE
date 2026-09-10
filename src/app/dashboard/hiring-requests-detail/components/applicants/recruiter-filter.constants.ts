import type { Recruiter } from "./recruiter-filter.types";

export const RECRUITER_COLORS = [
  "var(--accent)", "var(--accent-indigo)", "var(--success)", "var(--warning)",
  "var(--danger)", "var(--accent-violet)", "var(--aurora-cyan)", "var(--aurora-pink)",
];

export const MOCK_RECRUITERS: Recruiter[] = [
  { id: "1", name: "Alice Johnson", count: 12 },
  { id: "2", name: "Bob Smith", count: 8 },
  { id: "3", name: "Carol Davis", count: 15 },
  { id: "4", name: "David Lee", count: 5 },
  { id: "5", name: "Eve Wilson", count: 10 },
  { id: "6", name: "Frank Brown", count: 7 },
  { id: "7", name: "Grace Taylor", count: 3 },
];

export const STATUS_DISPLAY: Record<string, { label: string; cls: string }> = {
  new: { label: "New", cls: "state-chip--info" },
  resume_shortlisted: { label: "Resume Shortlisted", cls: "state-chip--success" },
  under_evaluation: { label: "Evaluating", cls: "state-chip--warning" },
  shortlisted: { label: "Shortlisted", cls: "state-chip--success" },
  move_to_next_round: { label: "Ready to schedule", cls: "state-chip--success" },
  rejected: { label: "Moved Out Of Pipeline", cls: "state-chip--danger" },
  scheduled: { label: "Scheduled", cls: "state-chip--info" },
  interview_scheduled: { label: "Interview Scheduled", cls: "state-chip--info" },
  interview_rescheduled: { label: "Rescheduled", cls: "state-chip--warning" },
  interview_cancelled: { label: "Cancelled", cls: "state-chip--danger" },
  ongoing: { label: "Ongoing", cls: "state-chip--info" },
  screening_round_scheduled: { label: "Screening Round Scheduled", cls: "state-chip--info" },
  waiting_for_review: { label: "Waiting", cls: "state-chip--yellow" },
  selected: { label: "Selected And Closed", cls: "state-chip--success" },
  "on-hold": { label: "On Hold", cls: "state-chip--warning" },
};
