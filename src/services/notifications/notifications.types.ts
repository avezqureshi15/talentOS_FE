export type NotificationApiItem = {
  id: string;
  employee_id: number;
  type: string;
  title: string;
  body: string | null;
  action_url: string | null;
  action_label: string | null;
  form_id: string | null;
  job_id: string | null;
  candidate_id: number | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
};

export type NotificationPagination = {
  current_page: number;
  per_page: number;
  total_records: number;
  has_more: boolean;
};

export type NotificationsApiData = {
  notifications: NotificationApiItem[];
  pagination: NotificationPagination;
};

export type NotificationsApiResponse = {
  success: boolean;
  data: NotificationsApiData;
};

export type UnreadCountApiResponse = {
  success: boolean;
  data: { unread_count: number };
};
