import { useState } from "react";
import "./detail.css";

import JobDescription from "@/app/dashboard/hiring-requests-detail/components/job-desc/job-desc";
import Applicants, { type Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants";
import { JOB_DETAIL } from "@/constants/constants";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";

type Segment = "jd" | "applicants";

const applicants: Applicant[] = [
  {
    id: "1",
    name: "Aman Verma",
    experienceYears: 3,
    linkedinUrl: "https://linkedin.com",
    cvUrl: "/cv.pdf",
    status: "new",
  },
  {
    id: "2",
    name: "Rohit Singh",
    experienceYears: 5,
    linkedinUrl: "https://linkedin.com",
    cvUrl: "/cv.pdf",
    status: "shortlisted",
  },
];

export default function JobDetail() {
  const [segment, setSegment] = useState<Segment>("jd");
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="job-page">

      {/* HEADER */}
  <div className="job-header">
  {/* LEFT: BACK BUTTON */}
  <button className="back-btn" onClick={() => window.history.back()}>
    <i className="bx bx-arrow-left-stroke"></i>
  </button>

  {/* TITLE */}
  <div className="header-text">{JOB_DETAIL.TITLE}</div>

  {/* RIGHT: ACTIONS */}
  <div className="header-actions">
    <button className="export-btn" onClick={()=>{}}>
      {JOB_DETAIL.EXPORT_AS_EXCEL}
    </button>
  </div>
</div>

      {/* SUBTITLE */}
      <div className="job-subtitle ">
        {JOB_DETAIL.SUBTITLE}
      </div>

      {/* SEGMENT NAV (Flowbite-inspired, but dark SaaS tuned) */}
      <div className="segment-nav">
        <button
          className={`segment-item ${segment === "jd" ? "active" : ""}`}
          onClick={() => setSegment("jd")}
        >
          {JOB_DETAIL.JOB_DESCRIPTION}
        </button>

        <button
          className={`segment-item ${segment === "applicants" ? "active" : ""}`}
          onClick={() => setSegment("applicants")}
        >
          {JOB_DETAIL.APPLICANTS}
        </button>
      </div>

      {/* CONTENT */}
      <div className="tab-content">
        <ErrorBoundary>
          {segment === "jd" && <JobDescription />}
          {segment === "applicants" && (
            <Applicants
              data={applicants}
              openId={openId}
              setOpenId={setOpenId}
            />
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
}