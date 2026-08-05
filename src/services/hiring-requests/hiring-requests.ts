import httpClient from "@/services/http-client";
import type {
  HiringRequest,
  HiringRequestCreatePayload,
  HiringRequestsFilters,
  HiringRequestsListResponse,
  HiringRequestDetailResponse,
  DepartmentsResponse,
} from "./hiring-requests.types";
import { API_ENDPOINTS, PAGINATION } from "@/constants/api-endpoints";

export const fetchDepartments = async (): Promise<string[]> => {
  const { data } = await httpClient.get<DepartmentsResponse>(API_ENDPOINTS.HIRING_REQUESTS_DEPARTMENTS);
  return data.data;
};

export const fetchLocations = async (): Promise<string[]> => {
  const { data } = await httpClient.get<DepartmentsResponse>(API_ENDPOINTS.HIRING_REQUESTS_LOCATIONS);
  return data.data;
};

export const fetchTypes = async (): Promise<string[]> => {
  const { data } = await httpClient.get<DepartmentsResponse>(API_ENDPOINTS.HIRING_REQUESTS_TYPES);
  return data.data;
};

export const fetchHiringRequests = async (filters?: HiringRequestsFilters): Promise<HiringRequestsListResponse> => {
  const params: Record<string, string | number | boolean | undefined> = {
    q: filters?.q,
    department: filters?.department,
    location: filters?.location,
    type: filters?.type,
    is_active: filters?.is_active,
    created_from: filters?.created_from,
    created_to: filters?.created_to,
    page: filters?.page ?? PAGINATION.DEFAULT_PAGE,
    per_page: filters?.per_page ?? PAGINATION.DEFAULT_PER_PAGE,
  };
  const clean = Object.fromEntries(Object.entries(params).filter((entry) => entry[1] !== undefined && entry[1] !== ""));
  const { data } = await httpClient.get<HiringRequestsListResponse>(API_ENDPOINTS.HIRING_REQUESTS, { params: clean });
  return data;
};

export const fetchHiringRequestById = async (id: string): Promise<HiringRequest> => {
  const { data } = await httpClient.get<HiringRequestDetailResponse>(`${API_ENDPOINTS.HIRING_REQUESTS}${id}`);
  return data.data;
};

export const createHiringRequest = async (payload: HiringRequestCreatePayload): Promise<HiringRequest> => {
  const { data } = await httpClient.post<HiringRequestDetailResponse>(API_ENDPOINTS.HIRING_REQUESTS, payload);
  return data.data;
};

export const toggleHiringRequestStatus = async (id: string): Promise<HiringRequest> => {
  const { data } = await httpClient.patch<HiringRequestDetailResponse>(`${API_ENDPOINTS.HIRING_REQUESTS}${id}/status`);
  return data.data;
};

export type ExportHiringRequestResult = {
  blob: Blob;
  filename: string;
};

const FALLBACK_EXPORT_FILENAME = "Hiring_Request_applicants.xlsx";

function filenameFromContentDisposition(header: string | undefined): string | null {
  if (!header) return null;
  const utfMatch = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (utfMatch?.[1]) {
    try {
      return decodeURIComponent(utfMatch[1].trim());
    } catch {
      return utfMatch[1].trim();
    }
  }
  const plainMatch = /filename="?([^";]+)"?/i.exec(header);
  return plainMatch?.[1]?.trim() ?? null;
}

export const exportHiringRequestExcel = async (id: string): Promise<ExportHiringRequestResult> => {
  const response = await httpClient.get<Blob>(`${API_ENDPOINTS.HIRING_REQUESTS}${id}/export`, {
    responseType: "blob",
  });
  const filename =
    filenameFromContentDisposition(response.headers["content-disposition"]) ?? FALLBACK_EXPORT_FILENAME;
  return { blob: response.data, filename };
};

export type ImportRowError = {
  row: number;
  error: string;
};

export type ImportSummary = {
  total: number;
  imported: number;
  skipped_duplicates: number;
  failed: ImportRowError[];
};

export const importCandidatesFromExcel = async (id: string, file: File): Promise<ImportSummary> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await httpClient.post<ImportSummary>(
    API_ENDPOINTS.HIRING_REQUEST_IMPORT_CANDIDATES.replace("{hiring_request_id}", id),
    formData,
    { headers: { "Content-Type": "multipart/form-data" }, timeout: 120_000 },
  );
  return data;
};

const FALLBACK_TEMPLATE_FILENAME = "candidates_template.xlsx";

export const downloadImportTemplate = async (id: string): Promise<ExportHiringRequestResult> => {
  const response = await httpClient.get<Blob>(
    API_ENDPOINTS.HIRING_REQUEST_IMPORT_TEMPLATE.replace("{hiring_request_id}", id),
    { responseType: "blob" },
  );
  const filename =
    filenameFromContentDisposition(response.headers["content-disposition"]) ?? FALLBACK_TEMPLATE_FILENAME;
  return { blob: response.data, filename };
};
