import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "./detail.css";

import JobDescription from "@/app/dashboard/hiring-requests-detail/components/job-desc/job-desc";
import Applicants, { type Applicant, type ApplicantStatus } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import { JOB_DETAIL, BE_API_BASE_URL } from "@/constants/constants";
import { useApplications } from "@/app/dashboard/hiring-requests/hooks/use-applications";
import type { JobDetailProps } from "./detail.types";

type Segment = "jd" | "applicants";

const STATUS_MAP: Record<string, ApplicantStatus> = {
  pending: "new",
  reviewing: "reviewing",
  shortlisted: "shortlisted",
  rejected: "rejected",
  hired: "hired",
};

const JobDetail = ({ hiringRequest }: JobDetailProps) => {
  const [segment, setSegment] = useState<Segment>("jd");
  const [openId, setOpenId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch(`${BE_API_BASE_URL}/hiring-requests/${hiringRequest.id}/export`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${hiringRequest.title}_applicants.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // silently fail
    } finally {
      setIsExporting(false);
    }
  };

  const jobId = hiringRequest.supabase_job_id;
  const { data: apiApplications, isLoading: appsLoading } = useApplications(
    jobId,
    segment === "applicants",
  );

  const applicants: Applicant[] = useMemo(() => {
    if (!apiApplications) return [];

    return apiApplications.map((app) => ({
      id: app.id,
      name: app.name,
      email: app.email,
      phone: app.phone,
      coverLetter: app.cover_letter,
      experienceYears: 0,
      currentRole: "",
      currentCompany: "",
      linkedinUrl: "",
      cvUrl: app.resume_url ?? "",
      status: STATUS_MAP[app.status] ?? "new",
      appliedAt: app.created_at,
    }));
  }, [apiApplications]);

  return (
    <div className="job-page">
      <div className="job-header">
        <Link to="/hiring-requests" className="back-btn">
          <i className="bx bx-arrow-left-stroke"></i>
        </Link>

        <div className="header-text">{hiringRequest.title}</div>

        <div className="header-actions">
          <button className="export-btn" onClick={handleExport} disabled={isExporting}>
            {isExporting ? "Downloading..." : JOB_DETAIL.EXPORT_AS_EXCEL}
          </button>
        </div>
      </div>

      <div className="job-subtitle">
        {hiringRequest.department} &middot; {hiringRequest.location} &middot; {hiringRequest.type}
      </div>

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
          {segment === "applicants"
            ? `Applicants (${applicants.length})`
            : "Applicants"}
        </button>
      </div>

      <div className="tab-content">
        <ErrorBoundary>
          {segment === "jd" && <JobDescription hiringRequest={hiringRequest} />}
          {segment === "applicants" && (
            appsLoading ? (
              <LoadingSpinner />
            ) : (
              <Applicants
                data={applicants}
                openId={openId}
                setOpenId={setOpenId}
              />
            )
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default JobDetail;
