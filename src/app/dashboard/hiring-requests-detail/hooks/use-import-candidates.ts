import { useCallback, useState } from "react";
import * as XLSX from "xlsx";
import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ParsedCandidate, ImportResult } from "@/app/dashboard/hiring-requests-detail/components/modal/import-candidates-modal.types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_ROWS = 50;

const COL_ALIASES: Record<string, string[]> = {
  name: ["name", "full_name", "fullname", "candidate_name", "candidate name"],
  email: ["email", "email_address", "emailaddress", "e-mail", "candidate_email", "candidate email"],
  phone: ["phone", "phone_number", "phonenumber", "mobile", "telephone", "contact", "candidate_phone", "candidate phone"],
  resume_url: ["resume_url", "resume", "resume_link", "cv", "cv_url", "cv_link", "url", "resume url", "resume url", "cv url", "resume_link", "cv_link"],
};

function pick(normalized: Record<string, string>, field: string): string {
  const aliases = COL_ALIASES[field];
  if (!aliases) return "";
  for (const alias of aliases) {
    const val = normalized[alias];
    if (val != null) return String(val);
  }
  return "";
}

export function useImportCandidates(hiringRequestId: string) {
  const [parsedRows, setParsedRows] = useState<ParsedCandidate[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const parseFile = useCallback((f: File) => {
    setError(null);
    setFile(f);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawJson = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: "" });
        const json = rawJson.map((row) => {
          const normalized: Record<string, string> = {};
          for (const key of Object.keys(row)) {
            normalized[key.toLowerCase()] = row[key];
          }
          return normalized;
        });

        if (json.length > MAX_ROWS) {
          setError(`Maximum ${MAX_ROWS} candidates allowed per import, got ${json.length}`);
          setParsedRows([]);
          return;
        }

        const rows: ParsedCandidate[] = json.map((raw, idx) => {
          const rowNum = idx + 2;
          const name = pick(raw, "name").trim();
          const email = pick(raw, "email").trim();
          const phone = pick(raw, "phone").trim();
          const resume_url = pick(raw, "resume_url").trim();

          const reasons: string[] = [];
          if (!name) reasons.push("name is required");
          if (!email) reasons.push("email is required");
          else if (!EMAIL_RE.test(email)) reasons.push("invalid email format");
          if (!resume_url) reasons.push("resume_url is required");
          else if (!resume_url.startsWith("http://") && !resume_url.startsWith("https://")) {
            reasons.push("resume_url must be a valid URL");
          }

          return {
            row: rowNum,
            name,
            email,
            phone,
            resume_url,
            valid: reasons.length === 0,
            reason: reasons.length > 0 ? reasons.join("; ") : undefined,
          };
        });

        setParsedRows(rows);
      } catch {
        setError("Failed to parse file. Ensure it's a valid .xlsx or .csv file.");
        setParsedRows([]);
      }
    };
    reader.onerror = () => {
      setError("Failed to read file.");
      setParsedRows([]);
    };
    reader.readAsArrayBuffer(f);
  }, []);

  const uploadFile = useCallback(async (): Promise<ImportResult | null> => {
    if (!file) return null;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const url = API_ENDPOINTS.HIRING_REQUESTS_CANDIDATES_IMPORT.replace("{hiring_request_id}", hiringRequestId);
      const { data } = await httpClient.post<ImportResult>(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail
          ? Array.isArray(err.response.data.detail)
            ? err.response.data.detail.map((d: any) => d.reason || d.msg || JSON.stringify(d)).join("; ")
            : String(err.response.data.detail)
          : "Import failed. Please try again.";
      setError(msg);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [file, hiringRequestId]);

  const clear = useCallback(() => {
    setParsedRows([]);
    setError(null);
    setFile(null);
    setIsUploading(false);
  }, []);

  return { parsedRows, parseFile, uploadFile, isUploading, error, clear } as const;
}
