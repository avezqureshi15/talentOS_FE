export type ColumnDef = {
  key: string;
  label: string;
  width: string;
};

export const STAGE_COLUMNS: Record<string, ColumnDef[]> = {
  "yet-to-start": [
    { key: "candidate", label: "CANDIDATE", width: "2fr" },
    { key: "addedBy", label: "ADDED BY", width: "1fr" },
    { key: "addedAt", label: "ADDED", width: "1fr" },
    { key: "openingDate", label: "OPENING DATE", width: "1fr" },
    { key: "deadline", label: "DEADLINE", width: "1fr" },
  ],
  started: [
    { key: "candidate", label: "CANDIDATE", width: "2fr" },
    { key: "startedAt", label: "STARTED AT", width: "1fr" },
    { key: "timeElapsed", label: "TIME ELAPSED", width: "1fr" },
    { key: "status", label: "STATUS", width: "1fr" },
    { key: "deadline", label: "DEADLINE", width: "1fr" },
  ],
  evaluated: [
    { key: "candidate", label: "CANDIDATE", width: "2fr" },
    { key: "results", label: "RESULTS", width: "1.5fr" },
    { key: "aiProctoring", label: "AI PROCTORING", width: "1fr" },
    { key: "lastActivity", label: "LAST ACTIVITY", width: "1fr" },
    { key: "deadline", label: "DEADLINE", width: "1fr" },
  ],
  "no-show": [
    { key: "candidate", label: "CANDIDATE", width: "2fr" },
    { key: "addedBy", label: "ADDED BY", width: "1fr" },
    { key: "addedAt", label: "ADDED", width: "1fr" },
    { key: "openingDate", label: "OPENING DATE", width: "1fr" },
    { key: "deadline", label: "DEADLINE", width: "1fr" },
  ],
  archived: [
    { key: "candidate", label: "CANDIDATE", width: "2fr" },
    { key: "archivedBy", label: "ARCHIVED BY", width: "1fr" },
    { key: "reason", label: "REASON", width: "1.5fr" },
    { key: "archivedAt", label: "ARCHIVED AT", width: "1fr" },
  ],
};

export const EVALUATED_SUB_FILTERS = [
  { key: "all", label: "All" },
  { key: "completed", label: "Completed" },
  { key: "partial", label: "Partially Completed" },
];

export const SCORE_PILLS: { max: number; label: string; cls: string }[] = [
  { max: 5, label: "Advance", cls: "score-pill--success" },
  { max: 3, label: "Potential Fit", cls: "score-pill--warning" },
  { max: 0, label: "Reject", cls: "score-pill--danger" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MOCK_CANDIDATES: Record<string, any> = {
  "yet-to-start": [
    { id: "c1", name: "Sarah Johnson", email: "sarah@example.com", addedBy: "Alice", addedAt: "2026-07-20", openingDate: "2026-07-01", deadline: "2026-07-25" },
    { id: "c2", name: "Mike Peters", email: "mike@example.com", addedBy: "Bob", addedAt: "2026-07-21", openingDate: "2026-07-01", deadline: "2026-07-22" },
  ],
  started: [
    { id: "c3", name: "Emily Davis", email: "emily@example.com", startedAt: "2026-07-22 09:00", status: "In Progress", deadline: "2026-07-28" },
    { id: "c4", name: "James Wilson", email: "james@example.com", startedAt: "2026-07-22 10:30", status: "Paused", deadline: "2026-07-28" },
  ],
  evaluated: [
    { id: "c5", name: "Anna Taylor", email: "anna@example.com", results: [{ score: 4.9, label: "Advance" }], aiProctoring: "clean", lastActivity: "2026-07-23 14:00", deadline: "2026-07-28" },
    { id: "c6", name: "Tom Harris", email: "tom@example.com", results: [{ score: 1.5, label: "Reject" }], aiProctoring: "cheating", lastActivity: "2026-07-22 16:00", deadline: "2026-07-28" },
    { id: "c7", name: "Lisa Brown", email: "lisa@example.com", partialProgress: { completed: 3, total: 5 }, aiProctoring: "clean", lastActivity: "2026-07-23 11:00", deadline: "2026-07-28" },
    { id: "c8", name: "Ryan Clark", email: "ryan@example.com", results: [{ score: 2.7, label: "Potential Fit" }], aiProctoring: "clean", lastActivity: "2026-07-23 09:00", deadline: "2026-07-28" },
  ],
  "no-show": [
    { id: "c9", name: "Kevin White", email: "kevin@example.com", addedBy: "Carol", addedAt: "2026-07-18", openingDate: "2026-07-01", deadline: "2026-07-24" },
  ],
  archived: [
    { id: "c10", name: "Natalie Green", email: "natalie@example.com", archivedBy: "Admin", reason: "Withdrew application", archivedAt: "2026-07-21" },
  ],
};
