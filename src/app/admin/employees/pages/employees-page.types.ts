export type Employee = {
  id: number;
  user_id: number | null;
  emp_id: string;
  email: string;
  name: string;
  designation: string | null;
  department: string | null;
  personal_email: string | null;
  contact_number: string | null;
  hrms_id: string | null;
  status: string | null;
  user_type: string | null;
  work_mode: string | null;
  delivery_status: string | null;
  work_location_type: string | null;
  doj: string | null;
  doe: string | null;
  date_of_birth: string | null;
  internship_duration: number | null;
  band: string | null;
  skills: string | null;
  tenant_id: number | null;
  created_at: string;
};

export type PaginatedEmployees = {
  data: Employee[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
};

export type EmployeesListParams = {
  q?: string;
  page?: number;
  per_page?: number;
};

export type EmployeeImportRowError = {
  row: number;
  error: string;
};

export type EmployeeImportSummary = {
  total: number;
  imported: number;
  skipped_duplicates: number;
  failed: EmployeeImportRowError[];
};

export type UpdateEmployeePayload = {
  name?: string | null;
  email?: string | null;
  personal_email?: string | null;
  hrms_id?: string | null;
  designation?: string | null;
  department?: string | null;
  contact_number?: string | null;
  band?: string | null;
  user_type?: string | null;
  status?: string | null;
  work_mode?: string | null;
  delivery_status?: string | null;
  work_location_type?: string | null;
  doj?: string | null;
  doe?: string | null;
  date_of_birth?: string | null;
  internship_duration?: number | null;
  skills?: string | null;
};

export type ImportTemplateResult = {
  blob: Blob;
  filename: string;
};
