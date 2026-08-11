import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export type UserItem = {
  id: number;
  emp_id: string;
  email: string;
  name: string;
  role: string;
  designation: string;
  department: string;
  slots_count?: number;
  has_slots?: boolean;
};

export type UserDetailResponse = {
  id: number;
  emp_id: string;
  email: string;
  personal_email: string | null;
  name: string;
  status: string;
  user_type: string;
  designation: string;
  department: string;
  phone_number: string | null;
  role: string;
  work_mode: string;
  delivery_status: string;
  work_location_type: string;
  created_at: string;
};

export type PaginatedUsersResponse = {
  data: UserItem[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
};

type EmployeeApiItem = {
  id: number;
  user_id: number | null;
  emp_id: string;
  email: string;
  name: string;
  designation: string | null;
  department: string | null;
  status: string | null;
  user_type: string | null;
  personal_email: string | null;
  contact_number: string | null;
  work_mode: string | null;
  delivery_status: string | null;
  work_location_type: string | null;
  slots_count?: number;
  has_slots?: boolean;
};

type PaginatedEmployeesApi = {
  data: EmployeeApiItem[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
};

// Picker returns employees.id as the option id — the schedule flow now
// treats interviewers as employees end-to-end (not users). Includes
// employees without a linked user (HR-only records), so HR can schedule
// against the full directory of the tenant.
const toUserItem = (e: EmployeeApiItem): UserItem => ({
  id: e.id,
  emp_id: e.emp_id,
  email: e.email,
  name: e.name,
  role: "",
  designation: e.designation ?? "",
  department: e.department ?? "",
  slots_count: e.slots_count,
  has_slots: e.has_slots,
});

const toUserDetail = (e: EmployeeApiItem, createdAt: string): UserDetailResponse => ({
  id: e.user_id ?? e.id,
  emp_id: e.emp_id,
  email: e.email,
  personal_email: e.personal_email,
  name: e.name,
  status: e.status ?? "",
  user_type: e.user_type ?? "",
  designation: e.designation ?? "",
  department: e.department ?? "",
  phone_number: e.contact_number,
  role: "",
  work_mode: e.work_mode ?? "",
  delivery_status: e.delivery_status ?? "",
  work_location_type: e.work_location_type ?? "",
  created_at: createdAt,
});

export const fetchUsers = async (
  q?: string,
  page: number = 1,
  per_page: number = 20,
  slotsInfo?: boolean,
  authorizedOnly?: boolean,
): Promise<PaginatedUsersResponse> => {
  const params: Record<string, string | number> = { page, per_page };
  if (q) params.q = q;
  if (slotsInfo) params.slotsInfo = "true";
  if (authorizedOnly) params.authorized_only = "true";
  const { data } = await httpClient.get<PaginatedEmployeesApi>(API_ENDPOINTS.EMPLOYEES, { params });
  const items = data.data.map(toUserItem);
  return {
    data: items,
    total: data.total,
    page: data.page,
    per_page: data.per_page,
    has_more: data.has_more,
  };
};

export const fetchUserByEmpId = async (empId: string): Promise<UserDetailResponse | null> => {
  try {
    const { data } = await httpClient.get<EmployeeApiItem & { created_at: string }>(
      `${API_ENDPOINTS.EMPLOYEES}${empId}`,
    );
    return toUserDetail(data, data.created_at);
  } catch {
    return null;
  }
};
