export type InterviewSectionType =
  | "INTRO"
  | "Q&A"
  | "SYSTEM DESIGN"
  | "SCENARIO"
  | "CLOSING"
  | "CUSTOM";

export interface InterviewDesignQuestion {
  id: string;
  question: string;
  score: number;
  timeAllocationMinutes: number;
  expected_points?: string[];
}

export interface InterviewDesignSection {
  id: string;
  title: string;
  type: InterviewSectionType;
  description: string;
  depth: string;
  questions: InterviewDesignQuestion[];
}

export type DesignSyncStatus = "synced" | "draft";

export interface InterviewDesign {
  hiring_request_id: string;
  screening_sections: InterviewDesignSection[];
  interview_sections: InterviewDesignSection[];
  review_sections: InterviewDesignSection[];
  // Whether each kind already has real AI-generated (or, for interview,
  // already poc-linked) content. Drives the one-time auto-fill in
  // use-auto-generate-design.ts — a kind is only ever auto-generated while
  // its flag is false, and never again once true.
  screening_ai_generated: boolean;
  interview_ai_generated: boolean;
  review_ai_generated: boolean;
  updated_at: string;
  sync_status: DesignSyncStatus;
  sync_errors: string[];
}

export type DesignQuestionKind = "screening" | "interview" | "review";

export interface GenerateDesignQuestionsPayload {
  kind: DesignQuestionKind;
  count?: number;
}

export interface UpdateInterviewDesignPayload {
  screening_sections?: InterviewDesignSection[];
  interview_sections?: InterviewDesignSection[];
  review_sections?: InterviewDesignSection[];
}
