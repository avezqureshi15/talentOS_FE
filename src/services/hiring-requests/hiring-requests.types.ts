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
  external_job_id: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type HiringRequestsListResponse = {
  data: HiringRequest[];
  count: number;
  page: number;
  per_page: number;
  total_pages: number;
  total: number;
  has_more: boolean;
};

export type HiringRequestsFilters = {
  q?: string;
  department?: string;
  location?: string;
  type?: string;
  is_active?: boolean;
  created_from?: string;
  created_to?: string;
  page?: number;
  per_page?: number;
};

export type HiringRequestDetailResponse = {
  data: HiringRequest;
};

export type DepartmentsResponse = {
  data: string[];
};
