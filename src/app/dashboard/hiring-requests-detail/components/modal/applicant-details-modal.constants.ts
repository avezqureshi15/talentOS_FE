import type { ApplicantDetailsModalProps } from "./applicant-details-modal.types";

export const APPLICANT_DETAILS_MODAL = {
  TITLE_PREFIX: "Details — ",
  CURRENT_CTC: "Current CTC",
  EXPECTED_CTC: "Expected CTC",
  LOCATION: "Location",
  EXPERIENCE: "Experience",
  NOTICE_PERIOD: "Notice Period",
  HOW_DID_YOU_HEAR: "How did you hear",
  WILLING_TO_RELOCATE: "Willing to Relocate",
  IMMEDIATE: "Immediate",
  LPA_SUFFIX: " LPA",
  YRS_SUFFIX: " yrs",
  DAYS_SUFFIX: " days",
  NO_DETAILS: "No additional details available.",
} as const;

export const LABEL_MAP: Record<keyof ApplicantDetailsModalProps["details"], string> = {
  currentCtc: APPLICANT_DETAILS_MODAL.CURRENT_CTC,
  expectedCtc: APPLICANT_DETAILS_MODAL.EXPECTED_CTC,
  location: APPLICANT_DETAILS_MODAL.LOCATION,
  yearsOfExperience: APPLICANT_DETAILS_MODAL.EXPERIENCE,
  noticePeriod: APPLICANT_DETAILS_MODAL.NOTICE_PERIOD,
  willingToRelocate: APPLICANT_DETAILS_MODAL.WILLING_TO_RELOCATE,
  howDidYouHear: APPLICANT_DETAILS_MODAL.HOW_DID_YOU_HEAR,
};

export const VALUE_SUFFIX: Partial<Record<keyof ApplicantDetailsModalProps["details"], string>> = {
  currentCtc: APPLICANT_DETAILS_MODAL.LPA_SUFFIX,
  expectedCtc: APPLICANT_DETAILS_MODAL.LPA_SUFFIX,
  yearsOfExperience: APPLICANT_DETAILS_MODAL.YRS_SUFFIX,
  noticePeriod: APPLICANT_DETAILS_MODAL.DAYS_SUFFIX,
};
