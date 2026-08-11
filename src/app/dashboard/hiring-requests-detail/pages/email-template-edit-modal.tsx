import { useEffect, useMemo, useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import EmailPreviewSkeleton from "./email-preview-skeleton";
import EmailTemplateEditor from "./email-template-editor";
import {
  usePreviewEmailTemplate,
  useUpdateEmailTemplate,
} from "./email-manager-hooks";
import type { EmailTemplateDetail } from "@/services/email-templates/email-templates";

type EmailTemplateEditModalProps = {
  open: boolean;
  template: EmailTemplateDetail | null;
  onClose: () => void;
};

const PREVIEW_DEBOUNCE_MS = 600;

export default function EmailTemplateEditModal({
  open,
  template,
  onClose,
}: EmailTemplateEditModalProps) {
  const [subject, setSubject] = useState(template?.subject_template ?? "");
  const [html, setHtml] = useState(template?.body_html_template ?? "");
  const [mode, setMode] = useState<"simple" | "advanced">("simple");

  const preview = usePreviewEmailTemplate();
  const update = useUpdateEmailTemplate();

  const debouncedSubject = useMemo(() => subject, [subject]);
  const debouncedHtml = useMemo(() => html, [html]);

  useEffect(() => {
    if (!open || !template) return;
    const t = setTimeout(() => {
      preview.mutate({
        key: template.key,
        payload: { subject_template: debouncedSubject, body_html_template: debouncedHtml },
      });
    }, PREVIEW_DEBOUNCE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, template?.key, debouncedSubject, debouncedHtml]);

  const previewResult =
    preview.isSuccess && preview.data?.key === template?.key ? preview.data : null;

  const isSaving = update.isPending;
  const isDirty =
    subject !== template?.subject_template || html !== template?.body_html_template;

  const handleSave = () => {
    if (!template) return;
    update.mutate({ key: template.key, payload: { subject_template: subject, body_html_template: html } });
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={template ? `Edit — ${template.name}` : "Edit template"}
      icon="bx bx-edit-alt"
      className="em-modal em-modal--wide"
    >
      {template && (
        <div className="em-edit">
          <div className="em-edit-field">
            <label className="em-edit-label" htmlFor="em-subject">
              Subject template
            </label>
            <input
              id="em-subject"
              className="em-edit-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject line…"
              disabled={!template.is_editable}
            />
            <div className="em-edit-hint">Placeholders: {template.placeholders.join(", ")}</div>
          </div>

          <div className="em-edit-field">
            <div className="em-edit-field-head">
              <label className="em-edit-label" htmlFor="em-body">
                Message
              </label>
              <div className="em-edit-mode-toggle">
                <button
                  type="button"
                  className={mode === "simple" ? "em-edit-mode-toggle--active" : ""}
                  onClick={() => setMode("simple")}
                >
                  Simple
                </button>
                <button
                  type="button"
                  className={mode === "advanced" ? "em-edit-mode-toggle--active" : ""}
                  onClick={() => setMode("advanced")}
                >
                  HTML
                </button>
              </div>
            </div>
            {mode === "simple" ? (
              <EmailTemplateEditor
                value={html}
                onChange={setHtml}
                disabled={!template.is_editable}
              />
            ) : (
              <textarea
                id="em-body"
                className="em-edit-textarea"
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                spellCheck={false}
                disabled={!template.is_editable}
              />
            )}
            <div className="em-edit-hint">
              Placeholders: {template.placeholders.join(", ")}
            </div>
          </div>

          <div className="em-edit-preview">
            <div className="em-edit-preview-head">
              <span className="em-edit-preview-title">Live preview</span>
              {previewResult && (
                <span className="em-edit-preview-subject">Subject: {previewResult.subject}</span>
              )}
            </div>
            <div className="em-edit-preview-frame">
              {previewResult ? (
                <iframe
                  className="em-preview-iframe"
                  srcDoc={previewResult.html}
                  sandbox=""
                  title={`${template.name} live preview`}
                />
              ) : (
                <EmailPreviewSkeleton />
              )}
            </div>
          </div>

          <div className="em-edit-actions">
            {isDirty && <span className="em-edit-dirty">Unsaved changes</span>}
            <button className="em-action-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              className="em-action-btn em-action-btn--primary"
              onClick={handleSave}
              disabled={isSaving || !template.is_editable}
            >
              {isSaving ? "Saving…" : "Save template"}
            </button>
          </div>
        </div>
      )}
    </BaseModal>
  );
}
