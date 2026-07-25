import type { TimelineStatus } from "./timeline.types";

export const EVENTS_BY_CANDIDATE_QUERY_KEY = (candidateId: number) =>
  ["events", "by-candidate", candidateId] as const;

export const TIMELINE_LABELS = {
  CANDIDATE_JOURNEY: "History",
  DOWNLOAD_RESUME: "Download Resume",
  ADD_REMARK: "Add Remark",
  NO_EVENTS: "No events yet for this candidate",
  ERROR_LOADING: "Failed to load history",
  RETRY: "Retry",
} as const;

export const STATE_TO_LABEL: Record<string, string> = {
  CANDIDATE_APPLIED: "Candidate Applied",
  EVALUATION_STARTED: "AI Evaluation Started",
  EVALUATION_COMPLETED: "AI Evaluation Completed",
  EVALUATION_FAILED: "AI Evaluation Failed",
  AI_SHORTLISTED: "AI Shortlisted",
  AI_REJECTED: "AI Rejected",
  HR_SHORTLISTED: "HR Shortlisted",
  HR_REJECTED: "HR Rejected",
  INTERVIEWER_REVIEWED: "Interviewer Reviewed",
  INTERVIEW_SCHEDULED: "Interview Scheduled",
  INTERVIEW_RESCHEDULED: "Interview Rescheduled",
  INTERVIEW_CANCELLED: "Interview Cancelled",
  INTERVIEW_COMPLETED: "Interview Completed",
  FINAL_SELECTED: "Final Selected",
  FINAL_REJECTED: "Final Rejected",
  ROUND_VERDICT_UPDATED: "Round Verdict Updated",
};

export const STATE_TO_STATUS: Record<string, TimelineStatus> = {
  CANDIDATE_APPLIED: "success",
  EVALUATION_STARTED: "queued",
  EVALUATION_COMPLETED: "success",
  EVALUATION_FAILED: "waiting",
  AI_SHORTLISTED: "success",
  AI_REJECTED: "waiting",
  HR_SHORTLISTED: "success",
  HR_REJECTED: "waiting",
  INTERVIEWER_REVIEWED: "success",
  INTERVIEW_SCHEDULED: "queued",
  INTERVIEW_RESCHEDULED: "waiting",
  INTERVIEW_CANCELLED: "waiting",
  INTERVIEW_COMPLETED: "success",
  FINAL_SELECTED: "success",
  FINAL_REJECTED: "waiting",
  ROUND_VERDICT_UPDATED: "success",
};
