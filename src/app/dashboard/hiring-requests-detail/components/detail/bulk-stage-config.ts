export type BulkStageFlags = {
  aiScreening: boolean;
  aiInterview: boolean;
  archive: boolean;
};

export const BULK_STAGE_CONFIG: Record<string, BulkStageFlags> = {
  "resume-shortlisting": { aiScreening: true, aiInterview: true, archive: true },
  screening: { aiScreening: false, aiInterview: true, archive: true },
  evaluation: { aiScreening: false, aiInterview: true, archive: true },
};

export function bulkSelectionKey(
  activeStage: string,
  screeningSubFilter: string,
  evaluationSubFilter: string,
): string {
  if (activeStage === "screening") return `screening:${screeningSubFilter}`;
  if (activeStage === "evaluation") return `evaluation:${evaluationSubFilter}`;
  return activeStage;
}

export function isBulkAdvanceSubFilter(
  activeStage: string,
  screeningSubFilter: string,
  evaluationSubFilter: string,
): boolean {
  if (activeStage === "resume-shortlisting") return true;
  if (activeStage === "screening") return screeningSubFilter === "completed" || screeningSubFilter === "flagged";
  if (activeStage === "evaluation") return evaluationSubFilter === "evaluated";
  return false;
}
