export type ComparisonField = {
  label: string;
  actual: string;
  expected: string;
};

export type RejectionDetailValue = {
  JD: string;
  Candidate: string;
};

export type RejectionDetailItem = Record<string, RejectionDetailValue>;
