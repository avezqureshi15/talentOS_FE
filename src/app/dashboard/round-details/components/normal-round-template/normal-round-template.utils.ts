import type { ReviewEntity } from "@/services/applications/applications.types";

const SKIP_COMPARISON_KEYS = new Set([
  "entity_type", "verdict", "ratings", "skills", "notes",
  "summary", "summary_md", "strong_matches", "gaps_and_concerns",
  "remarks", "rejection_details", "rejected_status", "rejected_reason",
  "average_rating",
]);

export type ComparisonField = { label: string; actual: string; expected: string };

export const extractComparisonFields = (entity: ReviewEntity): ComparisonField[] => {
  const fields: ComparisonField[] = [];
  for (const key of Object.keys(entity)) {
    if (SKIP_COMPARISON_KEYS.has(key)) continue;
    const val = entity[key];
    if (val && typeof val === "object" && !Array.isArray(val) && "actual" in val && "expected" in val) {
      fields.push({ label: key, actual: String(val.actual), expected: String(val.expected) });
    }
  }
  return fields;
};
