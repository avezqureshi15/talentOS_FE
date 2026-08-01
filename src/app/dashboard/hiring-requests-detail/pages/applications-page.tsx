import { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import JobDetail from "@/app/dashboard/hiring-requests-detail/components/detail/detail";
import { useHiringRequestHeader } from "@/app/dashboard/hiring-requests-detail/pages/use-hiring-request-header";
import ImportCandidatesModal from "@/app/dashboard/hiring-requests-detail/components/import-candidates/import-candidates-modal";
import { useJobRoleStrip } from "@/components/shared/job-role-strip/use-job-role-strip";
import { HEADER_DEFAULT_VIEW } from "@/layouts/protected-layouts/components/header/header.constants";
import type { HiringRequestContext } from "./hiring-request-layout";

const ApplicationsPage = () => {
  const { data } = useOutletContext<HiringRequestContext>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { label, icon, tooltip, resolved } = useJobRoleStrip(id ?? "");
  const [isImportOpen, setIsImportOpen] = useState(false);

  const headerConfig = useHiringRequestHeader({
    id,
    data,
    activeView: HEADER_DEFAULT_VIEW,
    badge: resolved && label !== null ? { label, icon: icon || undefined, tooltip: tooltip ?? undefined } : undefined,
    onImport: () => setIsImportOpen(true),
    onViewChange: (key: string) => {
      if (key === "board") navigate(`/hiring-requests/${id}/board`);
    },
  });

  return (
    <>
      <PageHeader {...headerConfig} />
      <ErrorBoundary>
        <JobDetail hiringRequest={data} />
      </ErrorBoundary>
      <ImportCandidatesModal open={isImportOpen} onClose={() => setIsImportOpen(false)} hiringRequestId={id ?? ""} />
    </>
  );
};

export default ApplicationsPage;
