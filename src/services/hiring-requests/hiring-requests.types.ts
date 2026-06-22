export type HiringRequest = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  benefits: string[];
  is_active: boolean;
  custom_evaluation_criteria: string;
  supabase_job_id: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type HiringRequestsListResponse = {
  data: HiringRequest[];
  count: number;
};

export type HiringRequestDetailResponse = {
  data: HiringRequest;
};
