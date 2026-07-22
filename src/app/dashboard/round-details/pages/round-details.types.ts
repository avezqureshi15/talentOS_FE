export type SubCriteriaStatus = "BELOW_BAR" | "MEETS_BAR" | "ABOVE_BAR";

export type EvidenceType = "positive" | "negative" | "warning";

export type AIRecommendation = "REJECT" | "ADVANCE" | "POTENTIAL_FIT";

export type SubCriteria = {
  title: string;
  status: SubCriteriaStatus;
  points: { type: EvidenceType; text: string }[];
};

export type EvaluationTopic = {
  id: string;
  title: string;
  rating: number;
  maxRating: number;
  summaryBullets: string[];
  subCriteria: SubCriteria[];
  timestampStart: number;
  problemStatement?: string;
};

export type TranscriptUtterance = {
  id: string;
  speaker: "INTERVIEWER" | "CANDIDATE";
  timestamp: string;
  timeInSeconds: number;
  text: string;
};

export type TranscriptSection = {
  id: string;
  title: string;
  utterances: TranscriptUtterance[];
};

export type CandidateEvaluationData = {
  candidateName: string;
  email: string;
  status: string;
  jobTitle: string;
  appliedDate: string;
  aiRecommendation: AIRecommendation;
  aiSummary: string;
  overallScore: number;
  criteriaMet: number;
  totalCriteria: number;
  topics: EvaluationTopic[];
  transcript: TranscriptUtterance[];
  transcriptSections: TranscriptSection[];
};

export type RoundDetailsParams = {
  id: string;
  candidateId: string;
};
