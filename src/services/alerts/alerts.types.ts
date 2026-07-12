export type EmployeeBrief = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type InterviewBrief = {
  id: string;
  candidate_name: string;
  position: string;
};

export type AlertApiItem = {
  id: string;
  type: string;
  employee: EmployeeBrief;
  slot_link: string | null;
  review_link: string | null;
  interview: InterviewBrief | null;
  created_at: string | null;
};

export type AlertPagination = {
  current_page: number;
  per_page: number;
  total_records: number;
  has_more: boolean;
};

export type AlertsApiData = {
  alerts: AlertApiItem[];
  pagination: AlertPagination;
};

export type AlertsApiResponse = {
  success: boolean;
  data: AlertsApiData;
};
