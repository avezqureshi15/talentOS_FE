import { useState } from "react";
import { Search, Eye, Send } from "lucide-react";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import DataTable from "@/components/ui/data-table/data-table";
import "./pages.css";

interface EmailTemplate {
  id: string;
  name: string;
  tag?: string;
  updatedAt: string;
  updatedBy: string;
}

const TEMPLATES: EmailTemplate[] = [
  { id: "1", name: "Interview Invitation", updatedAt: "06/07/2026, 5:58 PM", updatedBy: "Default template" },
  { id: "2", name: "Interview Reminder", updatedAt: "06/07/2026, 5:58 PM", updatedBy: "Default template" },
  { id: "3", name: "Completion Reminder", updatedAt: "06/07/2026, 5:58 PM", updatedBy: "Default template" },
  { id: "4", name: "Deadline Update", updatedAt: "06/07/2026, 5:58 PM", updatedBy: "Default template" },
  { id: "5", name: "Resume Interview Invitation", updatedAt: "06/07/2026, 5:58 PM", updatedBy: "Default template" },
  { id: "6", name: "Interview Not Completed", updatedAt: "06/07/2026, 5:58 PM", updatedBy: "Default template" },
  { id: "7", name: "Interview Not Completed", tag: "from_incomplete", updatedAt: "06/07/2026, 5:58 PM", updatedBy: "Default template" },
  { id: "8", name: "No Show Notice", updatedAt: "06/07/2026, 5:58 PM", updatedBy: "Default template" },
  { id: "9", name: "Interview Completed", updatedAt: "06/07/2026, 5:58 PM", updatedBy: "Default template" },
  { id: "10", name: "Rejection Notice", updatedAt: "06/07/2026, 5:58 PM", updatedBy: "Default template" },
  { id: "11", name: "Archive Confirmation", updatedAt: "06/07/2026, 5:58 PM", updatedBy: "Default template" },
];

const EmailManagerPage = () => {
  const [activeTab, setActiveTab] = useState<"templates" | "tracking">("templates");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = TEMPLATES.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Email Manager" />
      <ErrorBoundary>
        <div className="em-page">

          <div className="em-controls">
            <div className="em-tabs">
              <button
                className={`em-tab ${activeTab === "templates" ? "em-tab--active" : ""}`}
                onClick={() => setActiveTab("templates")}
              >
                Email Templates
              </button>
              <button
                className={`em-tab ${activeTab === "tracking" ? "em-tab--active" : ""}`}
                onClick={() => setActiveTab("tracking")}
              >
                Sent Emails Tracking
              </button>
            </div>

            <div className="em-search">
              <Search className="em-search-icon" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="em-search-input"
              />
            </div>
          </div>

          <DataTable
            columns={[
              {
                header: "Template",
                render: (t: EmailTemplate) => (
                  <div className="em-td-template">
                    <span className="em-template-name">{t.name}</span>
                    {t.tag && <span className="em-tag">{t.tag}</span>}
                  </div>
                ),
              },
              { header: "Updated", className: "em-td-muted", render: (t: EmailTemplate) => t.updatedAt },
              { header: "Updated by", className: "em-td-muted", render: (t: EmailTemplate) => t.updatedBy },
              {
                header: "Actions",
                className: "em-th-actions",
                render: () => (
                  <div className="em-action-group">
                    <button className="em-action-btn">
                      <Eye className="em-action-icon" />
                      <span>Preview</span>
                    </button>
                    <button className="em-action-btn">
                      <Send className="em-action-icon" />
                      <span>Test</span>
                    </button>
                  </div>
                ),
              },
            ]}
            data={filteredTemplates}
            keyExtractor={(t) => t.id}
            emptyMessage="No templates found"
            gridTemplateColumns="2fr 1.2fr 1fr 170px"
          />
        </div>
      </ErrorBoundary>
    </>
  );
};

export default EmailManagerPage;
