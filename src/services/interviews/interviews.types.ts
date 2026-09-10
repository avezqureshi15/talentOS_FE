export type PositionBrief = {
  id: string;
  title: string;
};

export type InterviewerBrief = {
  id: string;
  name: string;
  email: string;
};

export type CandidateBrief = {
  id: string;
  name: string | null;
  email: string | null;
};

export type ScheduleBrief = {
  start_time: string;
  end_time: string;
  timezone: string;
};

export type MeetingBrief = {
  platform: string | null;
  url: string | null;
};

export type InterviewApiItem = {
  id: string;
  status: string;
  interview_status: string;
  round_name: string;
  cancelled_at: string | null;
  position: PositionBrief;
  interviewer: InterviewerBrief;
  candidate: CandidateBrief;
  schedule: ScheduleBrief;
  meeting: MeetingBrief;
};

export type InterviewPagination = {
  current_page: number;
  per_page: number;
  total_records: number;
  has_more: boolean;
};

export type InterviewsApiData = {
  interviews: InterviewApiItem[];
  pagination: InterviewPagination;
};

export type InterviewsApiResponse = {
  success: boolean;
  data: InterviewsApiData;
};
