import { useState } from "react";
import "./detail.css";

import JobDescription from "../job-desc/job-desc";
import Applicants, { type Applicant } from "../applicants/applicants";

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
  <div className="header-text">Frontend Engineer Hiring</div>

  {/* RIGHT: ACTIONS */}
  <div className="header-actions">
    <button className="export-btn" onClick={()=>{}}>
      Export as Excel
    </button>
  </div>
</div>

      {/* SUBTITLE */}
      <div className="job-subtitle ">
        Manage job posting, review applicants, and track hiring pipeline.
      </div>

      {/* SEGMENT NAV (Flowbite-inspired, but dark SaaS tuned) */}
      <div className="segment-nav">
        <button
          className={`segment-item ${segment === "jd" ? "active" : ""}`}
          onClick={() => setSegment("jd")}
        >
          Job Description
        </button>

        <button
          className={`segment-item ${segment === "applicants" ? "active" : ""}`}
          onClick={() => setSegment("applicants")}
        >
          Applicants (24)
        </button>
      </div>

      {/* CONTENT */}
      <div className="tab-content">
        {segment === "jd" && <JobDescription />}
        {segment === "applicants" && (
          <Applicants
            data={applicants}
            openId={openId}
            setOpenId={setOpenId}
          />
        )}
      </div>
    </div>
  );
}