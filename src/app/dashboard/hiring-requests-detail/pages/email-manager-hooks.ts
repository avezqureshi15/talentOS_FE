import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchEmailTemplates,
  previewEmailTemplate,
  testEmailTemplate,
  updateEmailTemplate,
  type EmailTemplateUpdate,
} from "@/services/email-templates/email-templates";
import { QUERY_CONFIG } from "@/constants/constants";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";

const EMAIL_TEMPLATES_KEY = "email-templates";

export const useEmailTemplates = () =>
  useQuery({
    queryKey: [EMAIL_TEMPLATES_KEY],
    queryFn: fetchEmailTemplates,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
  });

export const useUpdateEmailTemplate = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);
  return useMutation({
    mutationFn: ({ key, payload }: { key: string; payload: EmailTemplateUpdate }) =>
      updateEmailTemplate(key, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMAIL_TEMPLATES_KEY] });
      addToast("Template saved", ToastType.SUCCESS);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to save template";
      addToast(msg, ToastType.ERROR);
    },
  });
};

export const usePreviewEmailTemplate = () =>
  useMutation({
    mutationFn: ({ key, payload }: { key: string; payload?: EmailTemplateUpdate }) =>
      previewEmailTemplate(key, payload),
  });

export const useTestEmailTemplate = () => {
  const addToast = useToastStore((s) => s.addToast);
  return useMutation({
    mutationFn: ({ key, toEmail }: { key: string; toEmail?: string }) =>
      testEmailTemplate(key, toEmail),
    onSuccess: (result) => {
      addToast(`Test email sent to ${result.to_email}`, ToastType.SUCCESS);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to send test email";
      addToast(msg, ToastType.ERROR);
    },
  });
};
