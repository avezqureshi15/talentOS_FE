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
  speaker: "INTERVIEWER" | "CANDIDATE" | "AI";
  timestamp?: string;
  timeInSeconds?: number;
  text: string;
};

export type TranscriptSection = {
  id: string;
  title: string;
  utterances: TranscriptUtterance[];
};

export type PointCoverage = {
  point: string;
  covered: boolean;
};

export type QuestionScore = {
  id: string;
  question: string;
  score?: number | null;
  earnedScore?: number | null;
  notes?: string;
  candidateAnswer?: string;
  expectedPoints?: string[];
  candidatePoints?: string[];
  pointCoverage?: PointCoverage[] | null;
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
  interviewUrl?: string | null;
  recordingUrl?: string | null;
  hrDecision?: string;
  jdFit?: string;
  strengths?: string[];
  weaknesses?: string[];
  transcriptSummary?: string;
  createdAt?: string;
  startedAt?: string;
  completedAt?: string;
  expiresAt?: string;
  questionScores?: QuestionScore[];
  rubricTotal?: number | null;
};

export type RoundDetailsParams = {
  id: string;
  roundId: string;
};

export type RoundDetailsMode = "ai-interview" | "normal-round";
