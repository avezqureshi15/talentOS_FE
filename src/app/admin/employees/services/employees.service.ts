import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type {
  Employee,
  EmployeeImportSummary,
  EmployeesListParams,
  ImportTemplateResult,
  PaginatedEmployees,
} from "@/app/admin/employees/pages/employees-page.types";

const FALLBACK_TEMPLATE_FILENAME = "employees_template.xlsx";

const filenameFromContentDisposition = (raw: string | undefined): string | undefined => {
  if (!raw) return undefined;
  const match = /filename="?([^"]+)"?/i.exec(raw);
  return match?.[1];
};

export const getEmployees = (params: EmployeesListParams) =>
  httpClient.get<PaginatedEmployees>(API_ENDPOINTS.EMPLOYEES, { params });

export const getEmployee = (empId: string) =>
  httpClient.get<Employee>(`${API_ENDPOINTS.EMPLOYEES}${empId}`);

export const importEmployeesFromExcel = async (file: File): Promise<EmployeeImportSummary> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await httpClient.post<EmployeeImportSummary>(
    API_ENDPOINTS.EMPLOYEES_IMPORT,
    formData,
    { headers: { "Content-Type": "multipart/form-data" }, timeout: 120_000 },
  );
  return data;
};

export const downloadEmployeesTemplate = async (): Promise<ImportTemplateResult> => {
  const response = await httpClient.get<Blob>(API_ENDPOINTS.EMPLOYEES_IMPORT_TEMPLATE, {
    responseType: "blob",
  });
  const filename =
    filenameFromContentDisposition(response.headers["content-disposition"]) ?? FALLBACK_TEMPLATE_FILENAME;
  return { blob: response.data, filename };
};
