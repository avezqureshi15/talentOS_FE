import { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import DecisionBoard from "@/app/dashboard/hiring-requests-detail/components/decision-board/decision-board";
import { useHiringRequestHeader } from "@/app/dashboard/hiring-requests-detail/pages/use-hiring-request-header";
import CloseJobModal from "@/app/dashboard/hiring-requests-detail/components/modal/close-job-modal";
import { useToggleStatus } from "@/app/dashboard/hiring-requests/hooks/use-toggle-status";
import type { HiringRequestContext } from "./hiring-request-layout";

const DecisionBoardPage = () => {
  const { data } = useOutletContext<HiringRequestContext>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pendingClose, setPendingClose] = useState(false);
  const closeMutation = useToggleStatus();

  const headerConfig = useHiringRequestHeader({
    id,
    data,
    activeView: "board",
    onArchived: () => navigate(`/hiring-requests/${id}/archived`),
    onCloseJob: () => setPendingClose(true),
    isJobClosing: closeMutation.isPending,
    onViewChange: (key: string) => {
      if (key === "pipeline") navigate(`/hiring-requests/${id}/applications`);
    },
  });

  return (
    <>
      <PageHeader {...headerConfig} />
      <ErrorBoundary>
        <DecisionBoard jobId={id ?? ""} />
      </ErrorBoundary>
      <CloseJobModal
        open={pendingClose}
        isActive={data.is_active}
        loading={closeMutation.isPending}
        onClose={() => setPendingClose(false)}
        onConfirm={() => closeMutation.mutate(id!, { onSuccess: () => setPendingClose(false) })}
      />
    </>
  );
};

export default DecisionBoardPage;
