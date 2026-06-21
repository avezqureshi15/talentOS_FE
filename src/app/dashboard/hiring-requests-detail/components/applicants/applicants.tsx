import { useState } from "react";
import ApplicantTimelineSheet from "@/app/dashboard/hiring-requests-detail/components/timeline/timeline";
import { APPLICANT_LABELS } from "@/constants/constants";

export type ApplicantStatus =
  | "new"
  | "reviewing"
  | "shortlisted"
  | "rejected"
  | "hired";

export type Applicant = {
  id: string;
  name: string;
  email?: string;
  experienceYears: number;
  currentRole?: string;
  currentCompany?: string;
  linkedinUrl: string;
  cvUrl: string;
  status: ApplicantStatus;
  score?: number;
  appliedAt?: string;
};

function Applicants({
  data,
  openId,
  setOpenId,
}: {
  data: Applicant[];
  openId: string | null;
  setOpenId: (id: string | null) => void;
}) {
  const [localData, setLocalData] = useState(data);
  const [screeningId, setScreeningId] = useState<string | null>(null);
  const [timelineId, setTimelineId] = useState<string | null>(null);

  const updateStatus = (id: string, status: ApplicantStatus) => {
    setLocalData((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  return (
    <div className="accordion-list">
      {localData.map((a) => {
        const isOpen = openId === a.id;
        const isScreening = screeningId === a.id;

        return (
          <div key={a.id} className="accordion-card">
            {/* HEADER */}
            <div className="accordion-header">
              {/* LEFT (click area) */}
              <div
                className="header-left"
                onClick={() => setOpenId(isOpen ? null : a.id)}
              >
                <div className="name">{a.name}</div>
                <div className="meta">
                  {a.experienceYears} yrs • {a.currentRole || "Engineer"}
                </div>
              </div>

              {/* RIGHT ACTION AREA */}
              <div className="header-right">
                {a.status === "reviewing" && (
                  <div className="queue-text mb-30">
                    {APPLICANT_LABELS.QUEUING}
                  </div>
                )}
                <div className={`status-dot ${a.status}`} />

                {a.status === "new" && !isScreening && (
                  <button
                    className="screen-btn compact"
                    onClick={(e) => {
                      e.stopPropagation();
                      setScreeningId(a.id);
                      setOpenId(a.id); // optional UX improvement
                    }}
                  >
                    {APPLICANT_LABELS.START_SCREENING}
                  </button>
                )}

                {a.status === "new" && isScreening && (
                  <>
                    <button
                      className="btn reject compact"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(a.id, "rejected");
                        setScreeningId(null);
                      }}
                    >
                      {APPLICANT_LABELS.REJECT}
                    </button>

                    <button
                      className="btn accept compact"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(a.id, "reviewing");
                        setScreeningId(null);
                      }}
                    >
                      {APPLICANT_LABELS.ACCEPT}
                    </button>


                  </>

                )}

              </div>
            </div>

            {/* BODY (unchanged, stable) */}
            {isOpen && (
              <div className="accordion-body ">
                <div className="action-links">
                  <a href={a.linkedinUrl} target="_blank" rel="noreferrer">
                    {APPLICANT_LABELS.LINKEDIN}
                  </a>

                  <a href={a.cvUrl} download>
                    {APPLICANT_LABELS.CV}
                  </a>

                  <button
                    className="timeline-trigger cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTimelineId(a.id);
                    }}
                  >
                    <span className="bx bx-clock" ></span> {APPLICANT_LABELS.TIMELINE}
                  </button>

                </div>



                {a.status === "rejected" && (
                  <div className="rejected-text">
                    {APPLICANT_LABELS.CANDIDATE_REJECTED}
                  </div>
                )}

                {a.status === "hired" && (
                  <div className="hired-text">
                    {APPLICANT_LABELS.CANDIDATE_HIRED}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <ApplicantTimelineSheet
        openId={timelineId}
        onClose={() => setTimelineId(null)}
      />
    </div>
  );
}

export default Applicants;