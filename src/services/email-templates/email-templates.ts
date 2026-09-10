import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export type EmailTemplateSummary = {
  key: string;
  name: string;
  description?: string | null;
  is_editable: boolean;
  updated_at: string;
  updated_by?: string | null;
};

export type EmailTemplateDetail = EmailTemplateSummary & {
  subject_template: string;
  body_html_template: string;
  placeholders: string[];
  sample_context: Record<string, string>;
};

export type EmailTemplateUpdate = {
  subject_template: string;
  body_html_template: string;
};

export type EmailTemplatePreview = {
  key: string;
  subject: string;
  html: string;
};

export type EmailTemplateTestResult = {
  success: boolean;
  message: string;
  to_email: string;
};

export type FetchEmailTemplatesResponse = {
  templates: EmailTemplateSummary[];
};

export const fetchEmailTemplates = async (): Promise<EmailTemplateSummary[]> => {
  const { data } = await httpClient.get<FetchEmailTemplatesResponse>(
    API_ENDPOINTS.EMAIL_TEMPLATES,
    { toastOnError: false },
  );
  return data.templates;
};

export const fetchEmailTemplate = async (key: string): Promise<EmailTemplateDetail> => {
  const { data } = await httpClient.get<EmailTemplateDetail>(
    API_ENDPOINTS.EMAIL_TEMPLATE_BY_KEY.replace("{key}", key),
    { toastOnError: false },
  );
  return data;
};

export const updateEmailTemplate = async (
  key: string,
  payload: EmailTemplateUpdate,
): Promise<EmailTemplateDetail> => {
  const { data } = await httpClient.put<EmailTemplateDetail>(
    API_ENDPOINTS.EMAIL_TEMPLATE_BY_KEY.replace("{key}", key),
    payload,
    { toastOnError: false },
  );
  return data;
};

export const previewEmailTemplate = async (
  key: string,
  payload?: EmailTemplateUpdate,
): Promise<EmailTemplatePreview> => {
  const { data } = await httpClient.post<EmailTemplatePreview>(
    API_ENDPOINTS.EMAIL_TEMPLATE_PREVIEW,
    { key, ...payload },
    { toastOnError: false },
  );
  return data;
};

export const testEmailTemplate = async (
  key: string,
  toEmail?: string,
): Promise<EmailTemplateTestResult> => {
  const { data } = await httpClient.post<EmailTemplateTestResult>(
    API_ENDPOINTS.EMAIL_TEMPLATE_TEST.replace("{key}", key),
    { to_email: toEmail },
    { toastOnError: false },
  );
  return data;
};
