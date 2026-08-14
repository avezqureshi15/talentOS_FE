import type {
  ComparisonField,
  RejectionDetailItem,
  RejectionDetailValue,
} from "./review-comparison.utils.types";

/** Keys that are never comparison metrics (actual/expected pairs). */
const SKIP_COMPARISON_KEYS = new Set([
  "entity_type",
  "verdict",
  "ratings",
  "skills",
  "notes",
  "summary",
  "summary_md",
  "strong_matches",
  "gaps_and_concerns",
  "remarks",
  "rejection_details",
  "rejected_status",
  "rejected_reason",
  "average_rating",
  "phases",
  "questions_source",
]);

/**
 * Backend writes placeholders like "?", "? yrs", "? LPA", "? days" when
 * candidate HR fields are missing. Treat blank and ?-prefixed values as unknown.
 * Real values such as "0 yrs" or "Remote" must remain visible.
 */
export const isUnknownCandidateValue = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) return true;
  return trimmed.startsWith("?");
};

const isActualExpectedPair = (
  val: unknown,
): val is { actual: unknown; expected: unknown } =>
  !!val &&
  typeof val === "object" &&
  !Array.isArray(val) &&
  "actual" in val &&
  "expected" in val;

export const extractComparisonFields = (
  entity: Record<string, unknown>,
): ComparisonField[] => {
  const fields: ComparisonField[] = [];
  for (const key of Object.keys(entity)) {
    if (SKIP_COMPARISON_KEYS.has(key)) continue;
    const val = entity[key];
    if (!isActualExpectedPair(val)) continue;
    fields.push({
      label: key,
      actual: String(val.actual),
      expected: String(val.expected),
    });
  }
  return fields;
};

export const filterKnownComparisonFields = (
  fields: ComparisonField[],
): ComparisonField[] => fields.filter((field) => !isUnknownCandidateValue(field.actual));

export const getKnownComparisonFields = (
  entity: Record<string, unknown>,
): ComparisonField[] => filterKnownComparisonFields(extractComparisonFields(entity));

const getRejectionCandidateValue = (item: RejectionDetailItem): string | null => {
  const keys = Object.keys(item);
  if (keys.length === 0) return null;
  const detail = item[keys[0]] as RejectionDetailValue | undefined;
  if (!detail || typeof detail.Candidate !== "string") return null;
  return detail.Candidate;
};

export const filterKnownRejectionDetails = (
  details: RejectionDetailItem[],
): RejectionDetailItem[] =>
  details.filter((item) => {
    const candidate = getRejectionCandidateValue(item);
    if (candidate === null) return false;
    return !isUnknownCandidateValue(candidate);
  });
