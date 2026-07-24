export type EvaluatedCandidate = {
  id: string;
  candidate_id: number;
  job_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  cover_letter: string | null;
  resume_url: string | null;
  status: string | null;
  fit_score: number | null;
  summary_md: string | null;
  evaluated_at: string | null;
  current_ctc: string | null;
  expected_ctc: string | null;
  location: string | null;
  years_of_experience: string | null;
  notice_period: string | null;
  how_did_you_hear: string | null;
  linkedin_url: string | null;
  willing_to_relocate?: boolean;
  current_round_id?: string;
  final_verdict?: string;
  rejected_status: string[];
  rejected_reason: string | null;
  rejection_details?: Array<Record<string, { JD: string; Candidate: string }>>;
  reviews?: Record<string, unknown> | null;
  review_verdict?: string | null;
  comparison_fields?: Array<{ label: string; value: { Expected: string; Actual: string } }>;
  active_interview?: {
    id: string;
    status: string;
    start_at: string | null;
    round_id: string;
    round_name: string | null;
    interviewer_user_id: number | null;
    interviewer_name: string | null;
  } | null;
};

export type RoundFromApi = {
  id: string;
  candidate_id: number | null;
  slot_id: string | null;
  jd_id: string | null;
  name: string | null;
  round_verdict: string | null;
  created_at: string;
  updated_at: string;
};

export type RoundsApiResponse = RoundFromApi[];

export type RatingItem = {
  label: string;
  score: number;
  max_score: number;
  entity_type?: string;
};

export type ReviewPhaseAnswerApi = {
  question: string;
  score: number;
  notes?: string | null;
};

export type ReviewPhaseApi = {
  phase: string;
  answers: ReviewPhaseAnswerApi[];
};

export type ReviewEntity = {
  entity_type: string;
  verdict?: string;
  ratings: RatingItem[];
  rejection_details?: Array<Record<string, { JD: string; Candidate: string }>>;
  average_rating?: number;
  skills?: string[];
  notes?: string;
  phases?: ReviewPhaseApi[];
  questions_source?: string;
  [key: string]: unknown;
};

export type RoundDetailApiResponse = {
  id: string;
  round: string | null;
  duration: string | null;
  interview_type: string | null;
  occurred_on: string | null;
  slot: string | null;
  status: string | null;
  candidate: string | null;
  role: string | null;
  jd_label: string | null;
  interviewer: string | null;
  has_interview?: boolean;
  interviewers?: string[];
  review_form_status?: string | null;
  reviews: ReviewEntity[];
};

export type EvaluatedCandidatesResponse = {
  data: EvaluatedCandidate[];
};

export type PaginatedEvaluatedCandidatesResponse = {
  data: EvaluatedCandidate[];
  total: number;
  limit: number;
  offset: number;
};
