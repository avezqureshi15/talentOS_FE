import { useState } from "react";
import ApplicantTimelineSheet from "@/app/dashboard/hiring-requests-detail/components/timeline/timeline";
import CoverLetterModal from "@/app/dashboard/hiring-requests-detail/components/modal/cover-letter-modal";
import AiSummaryModal from "@/app/dashboard/hiring-requests-detail/components/modal/ai-summary-modal";
import { APPLICANT_LABELS } from "@/constants/constants";

export type ApplicantStatus =
  | "new" | "reviewing" | "shortlisted" | "rejected" | "hired";

export type Applicant = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  coverLetter?: string;
  aiSummary?: string;
  experienceYears: number;
  currentRole?: string;
  currentCompany?: string;
  linkedinUrl: string;
  cvUrl: string;
  status: ApplicantStatus;
  score?: number;
  appliedAt?: string;
};

type Props = {
  data: Applicant[];
  openId: string | null;
  setOpenId: (id: string | null) => void;
};

type AccordionTab = "cover-letter" | "ai-summary";

function Applicants({ data, openId, setOpenId }: Props) {
  const [localData, setLocalData] = useState(data);
  const [screeningId, setScreeningId] = useState<string | null>(null);
  const [timelineId, setTimelineId] = useState<string | null>(null);
  const [coverLetterId, setCoverLetterId] = useState<string | null>(null);
  const [aiSummaryId, setAiSummaryId] = useState<string | null>(null);
  const [accordionTab, setAccordionTab] = useState<AccordionTab>("cover-letter");

  const updateStatus = (id: string, status: ApplicantStatus) => {
    setLocalData((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const truncateText = (text: string, limit: number) => {
    const words = text.split(/\s+/);
    if (words.length <= limit) return { text, truncated: false };
    return { text: words.slice(0, limit).join(" ") + "...", truncated: true };
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleTabChange = (tab: AccordionTab) => {
    setAccordionTab(tab);
  };

  return (
    <div className="accordion-list">
      {localData.map((a) => {
        const isOpen = openId === a.id;
        const isScreening = screeningId === a.id;
        const cl = a.coverLetter ? truncateText(a.coverLetter, 50) : null;
        const aiSum = a.aiSummary ? truncateText(a.aiSummary, 50) : null;

        return (
          <div key={a.id} className="accordion-card">
            <div className="accordion-header">
              <div className="header-left" onClick={() => setOpenId(isOpen ? null : a.id)}>
                <div className="name">{a.name}</div>
                <div className="meta">
                  {a.email && <span><i className="bx bx-envelope"></i> {a.email}</span>}
                  {a.appliedAt && (
                    <span className="applied-date">
                      <i className="bx bx-calendar"></i> {APPLICANT_LABELS.APPLIED} {formatDate(a.appliedAt)}
                    </span>
                  )}
                </div>
              </div>

              <div className="header-right">
                {a.status === "reviewing" && <div className="queue-text mb-30">{APPLICANT_LABELS.QUEUING}</div>}
                <div className={`status-dot ${a.status}`} />

                {a.status === "new" && !isScreening && (
                  <button className="screen-btn compact" onClick={(e) => { e.stopPropagation(); setScreeningId(a.id); setOpenId(a.id); }}>
                    {APPLICANT_LABELS.START_SCREENING}
                  </button>
                )}

                {a.status === "new" && isScreening && (
                  <>
                    <button className="btn reject compact" onClick={(e) => { e.stopPropagation(); updateStatus(a.id, "rejected"); setScreeningId(null); }}>
                      {APPLICANT_LABELS.REJECT}
                    </button>
                    <button className="btn accept compact" onClick={(e) => { e.stopPropagation(); updateStatus(a.id, "reviewing"); setScreeningId(null); }}>
                      {APPLICANT_LABELS.ACCEPT}
                    </button>
                  </>
                )}
              </div>
            </div>

            {isOpen && (
              <div className="accordion-body">
                <div className="action-links">
                  {a.phone && <a href={`tel:${a.phone}`} className="action-link"><i className="bx bx-phone"></i> {a.phone}</a>}
                  <a href={a.linkedinUrl} target="_blank" rel="noreferrer" className="action-link"><i className="bx bx-link-alt"></i> {APPLICANT_LABELS.LINKEDIN}</a>
                  <a href={a.cvUrl} target="_blank" rel="noreferrer" className="action-link"><i className="bx bx-file"></i> {APPLICANT_LABELS.CV}</a>
                  <button className="action-link action-link-btn" onClick={(e) => { e.stopPropagation(); setTimelineId(a.id); }}>
                    <i className="bx bx-clock"></i> {APPLICANT_LABELS.TIMELINE}
                  </button>
                </div>

                <div className="accordion-tabs block">
                  <button
                    className={`accordion-tab ${accordionTab === "cover-letter" ? "accordion-tab--active" : ""}`}
                    onClick={() => handleTabChange("cover-letter")}
                    type="button"
                  >
                    <i className="bx bx-notepad" />
                    {APPLICANT_LABELS.COVER_LETTER}
                  </button>
                  <button
                    className={`accordion-tab ${accordionTab === "ai-summary" ? "accordion-tab--active" : ""}`}
                    onClick={() => handleTabChange("ai-summary")}
                    type="button"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" /></svg>
                    {APPLICANT_LABELS.AI_SUMMARY}
                  </button>
                </div>

                {accordionTab === "cover-letter" && (
                  <div className="cover-letter">
                    <div className="cover-letter-label">
                      <i className="bx bx-notepad"></i>
                      {APPLICANT_LABELS.COVER_LETTER}
                    </div>
                    {cl ? (
                      <p className="cover-letter-text">
                        {cl.text}
                        {cl.truncated && (
                          <button className="read-more" onClick={(e) => { e.stopPropagation(); setCoverLetterId(a.id); }}>
                            {APPLICANT_LABELS.READ_MORE}
                          </button>
                        )}
                      </p>
                    ) : (
                      <p className="cover-letter-text">{APPLICANT_LABELS.NO_AI_SUMMARY}</p>
                    )}
                  </div>
                )}

                {accordionTab === "ai-summary" && (
                  <div className="cover-letter">
                    <div className="cover-letter-label">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" /></svg>
                      {APPLICANT_LABELS.AI_SUMMARY}
                    </div>
                    {aiSum ? (
                      <p className="cover-letter-text">
                        {aiSum.text}
                        {aiSum.truncated && (
                          <button className="read-more" onClick={(e) => { e.stopPropagation(); setAiSummaryId(a.id); }}>
                            {APPLICANT_LABELS.READ_MORE}
                          </button>
                        )}
                      </p>
                    ) : (
                      <p className="cover-letter-text">{APPLICANT_LABELS.NO_AI_SUMMARY}</p>
                    )}
                  </div>
                )}

                {a.status === "rejected" && <div className="rejected-text">{APPLICANT_LABELS.CANDIDATE_REJECTED}</div>}
                {a.status === "hired" && <div className="hired-text">{APPLICANT_LABELS.CANDIDATE_HIRED}</div>}
              </div>
            )}
          </div>
        );
      })}

      <ApplicantTimelineSheet openId={timelineId} onClose={() => setTimelineId(null)} />

      {localData.map((a) => (
        <CoverLetterModal
          key={`cl-${a.id}`}
          open={coverLetterId === a.id}
          applicantName={a.name}
          coverLetter={a.coverLetter ?? ""}
          onClose={() => setCoverLetterId(null)}
        />
      ))}

      {localData.map((a) => (
        <AiSummaryModal
          key={`ai-${a.id}`}
          open={aiSummaryId === a.id}
          applicantName={a.name}
          aiSummary={a.aiSummary ?? ""}
          onClose={() => setAiSummaryId(null)}
        />
      ))}
    </div>
  );
}

export default Applicants;
