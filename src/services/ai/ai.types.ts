export type AiScreeningResult = {
  screening_call_id: string;
  call_status: string;
  result: string | null;
  availability: string | null;
  employment_status: string | null;
  relevant_experience: string | null;
  current_ctc: string | null;
  expected_ctc: string | null;
  notice_period: string | null;
  location_preference: string | null;
  communication_quality: string | null;
  willingness_to_proceed: boolean | null;
  summary: string | null;
  transcript: string | null;
  call_outcome: string | null;
  retry_count: number;
  created_at: string;
};

export type AiInterviewItem = {
  id: string;
  status: string;
  hr_decision: string;
  created_at: string;
};

export type AiInterviewDetail = AiInterviewItem & {
  summary: string | null;
  overall_score: number | null;
  technical_fit_score: number | null;
  communication_score: number | null;
  problem_solving_score: number | null;
  experience_score: number | null;
  role_alignment_score: number | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  jd_fit: string | null;
  final_recommendation: string | null;
  transcript_summary: string | null;
};

export type MoveToScreeningResponse = {
  rh_candidate_id: string;
  screening_call_id: string;
  status: string;
};

export type MoveToScreeningPayload = {
  name: string;
  email: string;
  phone?: string;
  resume_url?: string;
};

export type TriggerInterviewPayload = {
  round_name?: string;
  interview_type?: string;
  round_type?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  timezone?: string;
};

export type TriggerInterviewResponse = {
  round_id: string;
  rh_external_session_id: string;
  status: string;
};
