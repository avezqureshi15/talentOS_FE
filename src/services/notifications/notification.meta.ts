export type NotificationTab = "all" | "slots" | "reviews" | "assignments" | "process";

export type NotificationMeta = {
  label: string;
  icon: string;
  tab: NotificationTab;
};

export const NOTIFICATION_META: Record<string, NotificationMeta> = {
  SLOTS: { label: "Slot request", icon: "bx bx-stopwatch", tab: "slots" },
  REVIEW: { label: "Review pending", icon: "bx bx-check-shield", tab: "reviews" },
  REVIEW_SUBMITTED: { label: "Review submitted", icon: "bx bx-check-circle", tab: "reviews" },
  JOB_ASSIGNED: { label: "Job assigned", icon: "bx bx-briefcase", tab: "assignments" },
  ROLE_ASSIGNED: { label: "Role assigned", icon: "bx bx-user-check", tab: "assignments" },
  EVALUATION_COMPLETED: { label: "Evaluation completed", icon: "bx bx-check-double", tab: "process" },
  EVALUATION_FAILED: { label: "Evaluation failed", icon: "bx bx-x-circle", tab: "process" },
  INTERVIEW_SCHEDULED: { label: "Interview scheduled", icon: "bx bx-calendar-check", tab: "process" },
  FINAL_VERDICT: { label: "Final verdict", icon: "bx bx-flag", tab: "process" },
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
