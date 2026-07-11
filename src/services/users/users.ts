import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export type UserItem = {
  id: number;
  emp_id: string;
  email: string;
  name: string;
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

export const fetchUsers = async (
  q?: string,
  page: number = 1,
  per_page: number = 20,
  slotsInfo?: boolean,
): Promise<PaginatedUsersResponse> => {
  const params: Record<string, string | number> = { page, per_page };
  if (q) params.q = q;
  if (slotsInfo) params.slotsInfo = "true";
  const { data } = await httpClient.get<PaginatedUsersResponse>(API_ENDPOINTS.USERS, { params });
  return data;
};

export const fetchUserByEmpId = async (empId: string): Promise<UserDetailResponse | null> => {
  try {
    const { data } = await httpClient.get<UserDetailResponse>(`${API_ENDPOINTS.USERS}${empId}`);
    return data;
  } catch {
    return null;
  }
};
