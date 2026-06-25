export type EvaluatedCandidate = {
  id: string;
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
};

export type EvaluatedCandidatesResponse = {
  data: EvaluatedCandidate[];
};
