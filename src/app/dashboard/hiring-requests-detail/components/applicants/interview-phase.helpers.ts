export type ActiveInterview = {
  id: string;
  status: string;
  startAt: string | null;
  roundId: string;
  roundName: string | null;
  interviewerUserId: number | null;
  interviewerName: string | null;
};

export type InterviewPhase = "none" | "upcoming" | "in_progress";

const ACTIVE_STATUSES = new Set(["SCHEDULED", "RESCHEDULED"]);

/** Display-only phase from list snapshot + local clock. */
export function resolveInterviewPhase(
  activeInterview: ActiveInterview | null | undefined,
  now: Date = new Date(),
): InterviewPhase {
  if (!activeInterview) return "none";
  const status = (activeInterview.status || "").toUpperCase();
  if (!ACTIVE_STATUSES.has(status)) return "none";
  if (!activeInterview.startAt) return "upcoming";
  const start = new Date(activeInterview.startAt);
  if (Number.isNaN(start.getTime())) return "upcoming";
  return start.getTime() <= now.getTime() ? "in_progress" : "upcoming";
}
