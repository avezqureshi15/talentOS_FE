export const TIMELINE_STATUS = {
  DONE: "done",
  ACTIVE: "active",
  PENDING: "pending",
} as const;

export const SUB_LABELS: Record<string, string> = {
  "Understanding role requirements": "Parsing job context and constraints",
  "Analyzing band level": "Matching seniority signals",
  "Defining responsibilities": "Scoping key outcomes and ownership",
  "Preparing job description": "Drafting structured JD content",
  "Finalizing output": "Polishing and formatting",
} as const;

export const CONNECTOR_STATE = {
  FILLED: "filled",
  PARTIAL: "partial",
  EMPTY: "empty",
} as const;
