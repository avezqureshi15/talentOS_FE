export type ApplicantStatus =
  | "new" | "reviewing" | "shortlisted" | "rejected" | "hired";

export type Applicant = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  coverLetter?: string;
  aiSummary?: string;
  experienceYears: number;
  currentRole?: string;
  currentCompany?: string;
  linkedinUrl: string;
  cvUrl: string;
  status: ApplicantStatus;
  score?: number;
  appliedAt?: string;
};

export type ApplicantsProps = {
  data: Applicant[];
  openId: string | null;
  setOpenId: (id: string | null) => void;
  filter: string;
  onFilterChange: (value: string) => void;
};

export type AccordionTab = "cover-letter" | "ai-summary";
