import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type {
  GenerateDesignQuestionsPayload,
  InterviewDesign,
  UpdateInterviewDesignPayload,
} from "./questions.types";

export const getHiringRequestDesign = async (
  hiringRequestId: string,
): Promise<InterviewDesign> => {
  const { data } = await httpClient.get<InterviewDesign>(
    API_ENDPOINTS.AI_QUESTIONS.replace("{hiring_request_id}", hiringRequestId),
  );
  return data;
};

export const updateHiringRequestDesign = async (
  hiringRequestId: string,
  payload: UpdateInterviewDesignPayload,
): Promise<InterviewDesign> => {
  const { data } = await httpClient.put<InterviewDesign>(
    API_ENDPOINTS.AI_QUESTIONS.replace("{hiring_request_id}", hiringRequestId),
    payload,
  );
  return data;
};

export const generateHiringRequestDesignQuestions = async (
  hiringRequestId: string,
  payload: GenerateDesignQuestionsPayload,
): Promise<InterviewDesign> => {
  const { data } = await httpClient.post<InterviewDesign>(
    API_ENDPOINTS.AI_QUESTIONS_GENERATE.replace("{hiring_request_id}", hiringRequestId),
    payload,
    { toastOnError: false },
  );
  return data;
};

export type ExportInterviewDesignPdfResult = {
  blob: Blob;
  filename: string;
};

const FALLBACK_PDF_FILENAME = "interview_design.pdf";

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

export const exportInterviewDesignPdf = async (
  hiringRequestId: string,
  kind: "all" | "screening" | "interview" | "review" = "all",
): Promise<ExportInterviewDesignPdfResult> => {
  const response = await httpClient.get<Blob>(
    API_ENDPOINTS.AI_QUESTIONS_EXPORT.replace("{hiring_request_id}", hiringRequestId),
    {
      responseType: "blob",
      params: kind === "all" ? undefined : { kind },
    },
  );
  const filename =
    filenameFromContentDisposition(response.headers["content-disposition"]) ?? FALLBACK_PDF_FILENAME;
  return { blob: response.data, filename };
};
