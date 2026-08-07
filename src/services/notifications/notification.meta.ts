export type NotificationTab = "all" | "slots" | "reviews" | "assignments" | "process";

export type NotificationMeta = {
  label: string;
  icon: string;
  tab: NotificationTab;
  tone?: "failure";
};

export const NOTIFICATION_META: Record<string, NotificationMeta> = {
  SLOTS: { label: "Slot Request", icon: "bx bx-calendar-plus", tab: "slots" },
  REVIEW: { label: "Review Pending", icon: "bx bx-clipboard", tab: "reviews" },
  REVIEW_SUBMITTED: { label: "Review Submitted", icon: "bx bx-check-circle", tab: "reviews" },
  JOB_ASSIGNED: { label: "Job Allocated", icon: "bx bx-briefcase-alt-2", tab: "assignments" },
  JOB_CREATED: { label: "Job Created", icon: "bx bx-briefcase-alt-2", tab: "assignments" },
  ROLE_ASSIGNED: { label: "Role Changed", icon: "bx bx-user-pin", tab: "assignments" },
  EVALUATION_COMPLETED: { label: "Evaluation Completed", icon: "bx bx-badge-check", tab: "process" },
  EVALUATION_FAILED: { label: "Evaluation Failed", icon: "bx bx-badge-exclamation", tab: "process", tone: "failure" },
  INTERVIEW_SCHEDULED: { label: "Interview Scheduled", icon: "bx bx-calendar-event", tab: "process" },
  FINAL_VERDICT: { label: "Final Verdict", icon: "bx bx-trophy", tab: "process" },
};

export const NOTIFICATION_META_FALLBACK: NotificationMeta = {
  label: "Update",
  icon: "bx bx-bell",
  tab: "process",
};

export const NOTIFICATION_TABS: { key: NotificationTab; label: string; icon: string }[] = [
  { key: "all", label: "All", icon: "bx bx-bell" },
  { key: "slots", label: "Slots", icon: "bx bx-stopwatch" },
  { key: "reviews", label: "Reviews", icon: "bx bx-check-shield" },
  { key: "assignments", label: "Assignments", icon: "bx bx-briefcase" },
  { key: "process", label: "Process", icon: "bx bx-task" },
];

export const NOTIFICATION_TAB_TYPES: Record<Exclude<NotificationTab, "all">, { include: string[]; exclude: string[] }> = {
  slots: { include: ["SLOTS"], exclude: [] },
  reviews: { include: ["REVIEW", "REVIEW_SUBMITTED"], exclude: [] },
  assignments: { include: ["JOB_ASSIGNED", "ROLE_ASSIGNED"], exclude: [] },
  process: { include: [], exclude: ["SLOTS", "REVIEW", "REVIEW_SUBMITTED", "JOB_ASSIGNED", "ROLE_ASSIGNED"] },
};

export const getNotificationMeta = (type: string): NotificationMeta =>
  NOTIFICATION_META[type] ?? NOTIFICATION_META_FALLBACK;
