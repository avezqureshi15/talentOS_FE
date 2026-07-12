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
};

export type RoundFromApi = {
  id: string;
  candidate_id: number | null;
  slot_id: string | null;
  jd_id: string | null;
  name: string | null;
  created_at: string;
  updated_at: string;
};

export type RoundsApiResponse = RoundFromApi[];

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
  decisions: Record<string, string>;
  ai_summary: string | null;
  strong_matches: string[];
  gaps_and_concerns: string[];
  ratings: { label: string; score: number; max_score: number; entity_type?: string }[];
  skills: string[];
  notes: string | null;
  remarks_hr: string | null;
  remarks_interviewer: string | null;
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
