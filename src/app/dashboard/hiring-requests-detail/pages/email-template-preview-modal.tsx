import { useEffect } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import EmailPreviewSkeleton from "./email-preview-skeleton";
import { usePreviewEmailTemplate } from "./email-manager-hooks";
import type { EmailTemplateSummary } from "@/services/email-templates/email-templates";

type EmailTemplatePreviewModalProps = {
  open: boolean;
  template: EmailTemplateSummary | null;
  onClose: () => void;
};

export default function EmailTemplatePreviewModal({
  open,
  template,
  onClose,
}: EmailTemplatePreviewModalProps) {
  const preview = usePreviewEmailTemplate();

  useEffect(() => {
    if (open && template) {
      preview.mutate({ key: template.key });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, template?.key]);

  const result = preview.isSuccess && preview.data?.key === template?.key ? preview.data : null;

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={template ? `Preview — ${template.name}` : "Preview"}
      icon="bx bx-envelope-open"
      className="em-modal"
    >
      {template && (
        <div className="em-preview">
          <div className="em-preview-subject">
            <span className="em-preview-subject-label">Subject</span>
            <span className="em-preview-subject-value">{result?.subject || "Rendering…"}</span>
          </div>
          <div className="em-preview-frame">
            {result ? (
              <iframe
                className="em-preview-iframe"
                srcDoc={result.html}
                sandbox=""
                title={`${template.name} preview`}
              />
            ) : (
              <EmailPreviewSkeleton />
            )}
          </div>
          <div className="em-preview-hint">
            Preview uses sample data. Placeholders like {"{{recipient_name}}"} are filled with
            demo values.
          </div>
        </div>
      )}
    </BaseModal>
  );
}
