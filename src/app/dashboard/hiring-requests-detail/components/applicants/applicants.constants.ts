import type { Applicant } from "./applicants.types";

export const SCORE_FILTERS = [
  { value: "all", label: "All Scores" },
  { value: "gte80", label: "≥ 80" },
  { value: "gte70", label: "≥ 70" },
  { value: "gte50", label: "≥ 50" },
  { value: "lt50", label: "< 50" },
  { value: "lt30", label: "< 30" },
] as const;

export const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Candidates" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "non-shortlisted", label: "Non-shortlisted" },
  { value: "scheduled", label: "Scheduled" },
  { value: "unscheduled", label: "Unscheduled" },
];

export const STATUS_FILTER_LABELS: Record<string, string> = {
  shortlisted: "Shortlisted",
  "non-shortlisted": "Non-shortlisted",
  scheduled: "Scheduled",
  unscheduled: "Unscheduled",
};

export const REJECT_FILTER_OPTIONS = [
  { value: "yoe", label: "Years of Experience" },
  { value: "budget", label: "Budget" },
  { value: "location", label: "Location" },
  { value: "notice-period", label: "Notice Period" },
  { value: "experience", label: "Experience" },
];

export const REJECT_FILTER_LABELS: Record<string, string> = {
  yoe: "Years of Experience",
  budget: "Budget",
  location: "Location",
  "notice-period": "Notice Period",
  experience: "Experience",
};

export type InfoChipConfig = {
  label: string;
  title: string;
  actualKey: keyof Applicant;
  expectedKey: keyof Applicant;
  actualSuffix?: string;
  expectedSuffix?: string;
};

export const INFO_CHIPS: InfoChipConfig[] = [
  { label: "YOE", title: "Years Of Experience", actualKey: "yearsOfExperience", expectedKey: "experienceYears", actualSuffix: " yrs", expectedSuffix: " yrs" },
  { label: "BUDGET", title: "Budget", actualKey: "currentCtc", expectedKey: "expectedCtc", actualSuffix: " LPA", expectedSuffix: " LPA" },
  { label: "LOCATION", title: "Location", actualKey: "location", expectedKey: "location" },
  { label: "NOTICE PERIOD", title: "Notice Period", actualKey: "noticePeriod", expectedKey: "noticePeriod", actualSuffix: " days", expectedSuffix: " days" },
  { label: "EXPERIENCE", title: "Experience", actualKey: "experienceYears", expectedKey: "yearsOfExperience", actualSuffix: " yrs", expectedSuffix: " yrs" },
];
