/**
 * Thin re-export of shared review-comparison helpers for round-details consumers.
 * Source of truth: @/utils/review-comparison
 */
export type { ComparisonField } from "@/utils/review-comparison/review-comparison.utils.types";
export {
  extractComparisonFields,
  filterKnownComparisonFields,
  getKnownComparisonFields,
  filterKnownRejectionDetails,
  isUnknownCandidateValue,
  getRejectedCriterionKeys,
  isComparisonFieldRejected,
} from "@/utils/review-comparison/review-comparison.utils";
