export type FormValidateResponse = {
  valid: boolean;
  reason: string;
  emp_id?: string;
  type?: string;
  round_id?: string;
  candidate_id?: number;
};

export type ReviewSubmitRequest = {
  entity_type: string;
  reviews: {
    communication: number;
    technical_skills: number;
    problem_solving: number;
    cultural_fit: number;
    average_rating: number;
    skills: string[];
    notes: string;
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
