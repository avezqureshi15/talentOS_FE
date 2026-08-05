import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import DataTable from "@/components/ui/data-table/data-table";
import { ROLE_DISPLAY } from "@/constants/role-display";
import {
  getUserJobAssignments,
  type UserJobAssignment,
  type UserJobAssignments,
} from "@/app/admin/users/services/users-admin.service";
import { PersonAvatar } from "@/components/shared/person-avatar/person-avatar";
import "./user-jobs-page.css";

const USER_JOBS_LABELS = {
  PAGE_TITLE: "User Details",
  BACK: "Back to Users",
  PRIMARY_ROLE: "Primary Role",
  STATUS: "Status",
  JOB_ASSIGNMENTS: "Job Assignments",
  JOB_TITLE: "Job",
  ASSIGNED_ON: "Assigned On",
  EMPTY_TITLE: "Not assigned to any job",
  EMPTY_SUBTITLE: "This user is not part of any hiring request team yet.",
  LOAD_FAILED: "Failed to load job assignments. Please try again.",
} as const;

const USER_JOBS_GRID = "40px 2fr 1fr";

export default function UserJobsPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const tenantId = (location.state as { tenantId?: number } | null)?.tenantId;

  const [data, setData] = useState<UserJobAssignments | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    getUserJobAssignments(Number(userId), tenantId)
      .then(({ data: res }) => {
        if (!cancelled) {
          setData(res);
          setLoadError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, tenantId]);

  const assignments = data?.data ?? [];
  const globalRole = data ? ROLE_DISPLAY[data.role] : undefined;

  const columns = [
    { header: "#", render: (_: UserJobAssignment, i: number) => i + 1 },
    {
      header: USER_JOBS_LABELS.JOB_TITLE,
      render: (a: UserJobAssignment) => (
        <button
          type="button"
          className="ujp-job-link"
          onClick={() => navigate(`/hiring-requests/${a.hiring_request_id}`)}
          title={a.job_title}
        >
          {a.job_title}
        </button>
      ),
    },
    {
      header: USER_JOBS_LABELS.ASSIGNED_ON,
      render: (a: UserJobAssignment) => (
        <span className="ujp-date">{new Date(a.created_at).toLocaleDateString()}</span>
      ),
    },
  ];

  return (
    <div className="ujp-page">
      <PageHeader
        title={USER_JOBS_LABELS.PAGE_TITLE}
        actions={[
          {
            key: "back",
            label: USER_JOBS_LABELS.BACK,
            variant: "outline",
            onClick: () => navigate("/admin/users"),
          },
        ]}
      />

      {data && !loadError && (
        <div className="ujp-user-card">
          <PersonAvatar
            className="ujp-avatar"
            person={{ name: data.name, email: data.email }}
          />
          <div className="ujp-user-info">
            <span className="ujp-user-name">{data.name}</span>
            <span className="ujp-user-email">{data.email}</span>
          </div>
          <div className="ujp-user-meta">
            <span className="ujp-meta-label">{USER_JOBS_LABELS.PRIMARY_ROLE}</span>
            {globalRole ? (
              <span className={`dt-chip dt-chip--${globalRole.chipVariant}`}>{globalRole.label}</span>
            ) : (
              <span className="dt-chip dt-chip--neutral">{data.role}</span>
            )}
          </div>
          <div className="ujp-user-meta">
            <span className="ujp-meta-label">{USER_JOBS_LABELS.STATUS}</span>
            <span className={`dt-badge dt-badge--${data.is_active ? "active" : "inactive"}`}>
              {data.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      )}

      <div className="ujp-content">
        <h2 className="ujp-section-title">{USER_JOBS_LABELS.JOB_ASSIGNMENTS}</h2>
        {loading ? (
          <DataTable
            columns={columns}
            data={[]}
            loading
            keyExtractor={(a) => a.hiring_request_id}
            emptyMessage=""
            gridTemplateColumns={USER_JOBS_GRID}
          />
        ) : loadError ? (
          <p className="ujp-hint">{USER_JOBS_LABELS.LOAD_FAILED}</p>
        ) : assignments.length === 0 ? (
          <div className="ujp-empty">
            <i className="bx bx-briefcase-alt" />
            <p className="ujp-empty-title">{USER_JOBS_LABELS.EMPTY_TITLE}</p>
            <p className="ujp-empty-subtitle">{USER_JOBS_LABELS.EMPTY_SUBTITLE}</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={assignments}
            keyExtractor={(a) => a.hiring_request_id}
            emptyMessage=""
            gridTemplateColumns={USER_JOBS_GRID}
          />
        )}
      </div>
    </div>
  );
}
