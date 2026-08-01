export type HiringRequest = {
  id: string;
  tenant_id: number | null;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[] | null;
  benefits: string[] | null;
  is_active: boolean;
  custom_evaluation_criteria: string | null;
  external_job_id: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type HiringRequestCreatePayload = {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements?: string[] | null;
  benefits?: string[] | null;
  is_active?: boolean;
  custom_evaluation_criteria?: string | null;
  tenant_id?: number | null;
};

export type HiringRequestsListResponse = {
  data: HiringRequest[];
  count: number;
  page: number;
  per_page: number;
  total_pages: number;
  total: number;
  has_more: boolean;
  can_create: boolean;
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
