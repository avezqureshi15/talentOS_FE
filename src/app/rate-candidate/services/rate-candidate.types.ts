export type ReviewPhase = {
  phase: string;
  questions: string[];
};

export type ReviewDesignQuestion = {
  question: string;
  score: number;
  expected_points: string[];
};

export type ReviewDesignSection = {
  section: string;
  questions: ReviewDesignQuestion[];
};

export type ReviewQuestionsData =
  | { format: "sections"; questions_source: string; sections: ReviewDesignSection[] }
  | { format: "phases"; questions_source: string; phases: ReviewPhase[] };

export type FormValidateResponse = {
  valid: boolean;
  reason: string;
  emp_id?: string;
  type?: string;
  round_id?: string;
  candidate_id?: number;
  hiring_request_id?: string;
  review_questions?: ReviewQuestionsData | null;
};

export type ReviewAnswerItem = {
  question: string;
  score: number;
  notes?: string | null;
};

export type ReviewAnswerPhase = {
  phase: string;
  answers: ReviewAnswerItem[];
};

export type ReviewAnswerSectionItem = {
  question: string;
  score: number;
  notes?: string | null;
};

export type ReviewAnswerSection = {
  section: string;
  answers: ReviewAnswerSectionItem[];
};

export type ReviewSubmitRequest = {
  entity_type: string;
  reviews: {
    questions_source: string;
    phases?: ReviewAnswerPhase[];
    sections?: ReviewAnswerSection[];
    average_rating: number;
    skills: string[];
  };
  verdict: string;
};

export type ReviewSubmitResponse = {
  id: string;
  round_id: string;
  entity_type: string;
  reviews: Record<string, unknown> | null;
  verdict: string | null;
  created_at: string;
  updated_at: string;
};

export type FormSubmitResponse = {
  message: string;
};

/** score 0 = unanswered */
export type QuestionAnswer = {
  score: number;
  notes: string;
};

export type AnswerMap = Record<string, QuestionAnswer>;
