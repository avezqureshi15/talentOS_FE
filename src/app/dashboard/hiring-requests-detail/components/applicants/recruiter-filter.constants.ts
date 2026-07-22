import type { Recruiter } from "./recruiter-filter.types";

export const RECRUITER_COLORS = [
  "#4f8ef7", "#6366f1", "#22c55e", "#f59e0b",
  "#ef4444", "#a855f7", "#06b6d4", "#ec4899",
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
  under_evaluation: { label: "Evaluating", cls: "state-chip--warning" },
  shortlisted: { label: "Shortlisted", cls: "state-chip--success" },
  move_to_next_round: { label: "Move to Next", cls: "state-chip--success" },
  rejected: { label: "Rejected", cls: "state-chip--danger" },
  scheduled: { label: "Scheduled", cls: "state-chip--info" },
  interview_rescheduled: { label: "Rescheduled", cls: "state-chip--warning" },
  interview_cancelled: { label: "Cancelled", cls: "state-chip--danger" },
  waiting_for_review: { label: "Waiting", cls: "state-chip--yellow" },
};
