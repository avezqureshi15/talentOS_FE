import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Pencil, Send } from "lucide-react";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import DataTable from "@/components/ui/data-table/data-table";
import { TruncatedCell } from "@/components/shared/truncated-cell/truncated-cell";
import { useAuth } from "@/app/auth/hooks/use-auth";
import {
  fetchEmailTemplate,
  type EmailTemplateDetail,
  type EmailTemplateSummary,
} from "@/services/email-templates/email-templates";
import {
  useEmailTemplates,
  useTestEmailTemplate,
} from "./email-manager-hooks";
import EmailTemplatePreviewModal from "./email-template-preview-modal";
import EmailTemplateEditModal from "./email-template-edit-modal";
import "./pages.css";

const formatUpdatedAt = (iso: string | undefined | null): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString([], {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const EmailManagerPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplateSummary | null>(null);
  const [editTemplateKey, setEditTemplateKey] = useState<string | null>(null);
  const [testingKey, setTestingKey] = useState<string | null>(null);

  const templatesQuery = useEmailTemplates();
  const testMutation = useTestEmailTemplate();

  const editTemplateQuery = useQuery({
    queryKey: ["email-template-detail", editTemplateKey],
    queryFn: () => fetchEmailTemplate(editTemplateKey!),
    enabled: !!editTemplateKey,
    retry: 1,
  });
  const editTemplate: EmailTemplateDetail | null = editTemplateQuery.data ?? null;

  const filteredTemplates = useMemo(() => {
    const rows = templatesQuery.data ?? [];
    if (!searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter(
      (t) => t.name.toLowerCase().includes(q) || t.key.toLowerCase().includes(q),
    );
  }, [templatesQuery.data, searchQuery]);

  const handleTest = (template: EmailTemplateSummary) => {
    setTestingKey(template.key);
    testMutation.mutate(
      { key: template.key, toEmail: user?.email ?? undefined },
      { onSettled: () => setTestingKey(null) },
    );
  };

  return (
    <>
      <PageHeader
        title="Email Templates"
        search={{
          placeholder: "Search templates...",
          value: searchQuery,
          onChange: setSearchQuery,
        }}
      />
      <ErrorBoundary>
        <div className="em-page">
          <DataTable
            columns={[
              {
                header: "Template",
                render: (t: EmailTemplateSummary) => (
                  <div className="em-td-template">
                    <TruncatedCell text={t.name} className="em-template-name" />
                  </div>
                ),
              },
              {
                header: "Updated",
                className: "em-td-muted",
                render: (t: EmailTemplateSummary) => formatUpdatedAt(t.updated_at),
              },
              {
                header: "Updated by",
                className: "em-td-muted",
                render: (t: EmailTemplateSummary) => <TruncatedCell text={t.updated_by ?? "Default template"} className="em-td-muted" />,
              },
              {
                header: "Actions",
                className: "em-th-actions",
                render: (t: EmailTemplateSummary) => (
                  <div className="em-action-group">
                    <button
                      className="em-action-btn"
                      onClick={() => setPreviewTemplate(t)}
                      title="Preview rendered email"
                    >
                      <Eye className="em-action-icon" />
                      <span>Preview</span>
                    </button>
                    <button
                      className="em-action-btn"
                      onClick={() => setEditTemplateKey(t.key)}
                      disabled={!t.is_editable}
                      title={t.is_editable ? "Edit template" : "Template is not editable"}
                    >
                      <Pencil className="em-action-icon" />
                      <span>Edit</span>
                    </button>
                    <button
                      className="em-action-btn"
                      onClick={() => handleTest(t)}
                      disabled={testingKey === t.key}
                      title={`Send a test to ${user?.email ?? "your email"}`}
                    >
                      <Send className="em-action-icon" />
                      <span>{testingKey === t.key ? "Sending…" : "Test"}</span>
                    </button>
                  </div>
                ),
              },
            ]}
            data={filteredTemplates}
            keyExtractor={(t) => t.key}
            loading={templatesQuery.isLoading}
            error={
              templatesQuery.isError
                ? "Failed to load email templates. Please try again."
                : null
            }
            onRetry={() => templatesQuery.refetch()}
            emptyMessage="No templates found"
            gridTemplateColumns="2fr 1.2fr 1fr 240px"
          />
        </div>
      </ErrorBoundary>

      <EmailTemplatePreviewModal
        open={!!previewTemplate}
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />

      <EmailTemplateEditModal
        key={editTemplate?.key ?? "em-edit-none"}
        open={!!editTemplateKey}
        template={editTemplate}
        onClose={() => setEditTemplateKey(null)}
      />
    </>
  );
};

export default EmailManagerPage;
