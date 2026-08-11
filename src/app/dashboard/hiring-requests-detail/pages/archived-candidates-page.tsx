import { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import Applicants from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants";
import ApplicantTimelineSheet from "@/app/dashboard/hiring-requests-detail/components/timeline/timeline";
import Skeleton from "@/components/ui/skeleton/skeleton";
import PaginationBar from "@/components/ui/pagination-bar/pagination-bar";
import BulkArchiveModal from "@/app/dashboard/hiring-requests-detail/components/modal/bulk-archive-modal";
import { useHiringRequestHeader } from "@/app/dashboard/hiring-requests-detail/pages/use-hiring-request-header";
import { useApplicationsData } from "@/app/dashboard/hiring-requests-detail/components/detail/use-applications-data";
import { useBulkSelection } from "@/app/dashboard/hiring-requests-detail/components/detail/use-bulk-selection";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/constants/permissions";
import { HEADER_DEFAULT_VIEW, HEADER_ARCHIVE_LABEL } from "@/layouts/protected-layouts/components/header/header.constants";
import type { HeaderConfig } from "@/store/header.store";
import type { HiringRequestContext } from "./hiring-request-layout";

import "../components/detail/detail.css";
import "./archived-candidates-page.css";

const ArchivedCandidatesPage = () => {
  const { data } = useOutletContext<HiringRequestContext>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { can } = usePermissions();
  const canWorkflow = can(PERMISSIONS.APPLICATION_WORKFLOW);

  const { applicants, total, isLoading, refresh, page, totalPages, pageSize, goToPage, setPageSize } =
    useApplicationsData(id, "all", true, undefined, undefined, undefined, undefined, true, false);

  const bulkSelection = useBulkSelection(id ?? "", applicants, refresh, canWorkflow);
  const [pendingRestore, setPendingRestore] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [timelineId, setTimelineId] = useState<number | null>(null);

  const headerConfig = useHiringRequestHeader({
    id,
    data,
    activeView: HEADER_DEFAULT_VIEW,
    title: HEADER_ARCHIVE_LABEL,
    titleIcon: "bx bx-archive-in",
    totalCount: total,
    onBack: () => navigate(-1),
    onArchived: undefined,
    onViewChange: (key: string) => {
      if (key === "board") navigate(`/hiring-requests/${id}/board`);
      else if (key === "pipeline") navigate(`/hiring-requests/${id}/applications`);
    },
  });

  const minimalHeaderConfig: HeaderConfig = {
    ...headerConfig,
    subtitle: undefined,
    hiringRequestName: undefined,
    hiringRequest: undefined,
    viewSwitcher: null,
    actions: headerConfig.actions?.filter((a) => a.key === "refresh") ?? [],
  };

  return (
    <>
      <PageHeader {...minimalHeaderConfig} />
      <div className="job-page">
        <div className="archived-page">
          <ErrorBoundary>
            {canWorkflow && bulkSelection.selectionCount > 0 && (
              <div className="bulk-action-bar">
                {bulkSelection.isBulkProcessing ? (
                  <div className="bulk-action-skeleton">
                    <Skeleton variant="text" width="220px" height="14px" className="bulk-action-skeleton-count" />
                    <div className="bulk-action-skeleton-buttons">
                      <Skeleton variant="rect" width="98px" height="34px" borderRadius="6px" />
                    </div>
                  </div>
                ) : (
                  <>
                <span className="bulk-action-count">{bulkSelection.selectionCount} candidate{bulkSelection.selectionCount !== 1 ? "s" : ""} selected</span>
                <div className="bulk-action-buttons">
                  <button
                    className="btn screen-btn compact"
                    onClick={() => setPendingRestore(true)}
                    disabled={bulkSelection.isBulkProcessing}
                    type="button"
                  >
                    {bulkSelection.activeAction === "archive" ? <i className="bx bx-loader-alt bx-spin" /> : <i className="bx bx-archive-out" />}
                    {" "}Restore
                  </button>
                  <button
                    className="bulk-action-clear"
                    onClick={bulkSelection.clearSelection}
                    disabled={bulkSelection.isBulkProcessing}
                    type="button"
                  >
                    Clear
                  </button>
                </div>
                  </>
                )}
              </div>
            )}

            {isLoading ? (
              <div className="archived-skeleton-list">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div className="archived-skeleton-card" key={i}>
                    <Skeleton variant="circle" width="34px" height="34px" />
                    <div className="archived-skeleton-lines">
                      <Skeleton variant="text" width="180px" height="14px" />
                      <Skeleton variant="text" width="240px" height="12px" />
                    </div>
                    <div className="archived-skeleton-side">
                      <Skeleton variant="rect" width="64px" height="22px" borderRadius="999px" />
                      <Skeleton variant="rect" width="76px" height="30px" borderRadius="8px" />
                    </div>
                  </div>
                ))}
              </div>
            ) : applicants.length === 0 ? (
              <div className="archived-page-empty">
                <i className="bx bx-archive-in" />
                <span>No archived candidates yet.</span>
              </div>
            ) : (
              <Applicants
                data={applicants}
                openId={openId}
                setOpenId={setOpenId}
                filter="all"
                onFilterChange={() => {}}
                rejectReason=""
                onRejectReasonChange={() => {}}
                onRefresh={refresh}
                jdId={id ?? ""}
                isRemote={false}
                showBulkSelection={canWorkflow}
                selectedIds={bulkSelection.selectedIds}
                onToggleSelect={bulkSelection.toggleSelect}
                onToggleSelectAll={bulkSelection.toggleSelectAll}
                allSelected={bulkSelection.allSelected}
                selectionCount={bulkSelection.selectionCount}
                timelineId={timelineId}
                onTimeline={setTimelineId}
              />
            )}
            <PaginationBar
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={pageSize}
              onPageChange={goToPage}
              onPageSizeChange={setPageSize}
            />
          </ErrorBoundary>
        </div>
      </div>

      <ApplicantTimelineSheet openId={timelineId} onClose={() => setTimelineId(null)} />

      <BulkArchiveModal
        open={pendingRestore}
        count={bulkSelection.selectionCount}
        restore
        onClose={() => setPendingRestore(false)}
        onConfirm={() => {
          setPendingRestore(false);
          bulkSelection.handleBulkArchive(false);
        }}
      />
    </>
  );
};

export default ArchivedCandidatesPage;
