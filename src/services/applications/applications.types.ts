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

export type EvaluatedCandidatesResponse = {
  data: EvaluatedCandidate[];
};

export type PaginatedEvaluatedCandidatesResponse = {
  data: EvaluatedCandidate[];
  total: number;
  limit: number;
  offset: number;
};
