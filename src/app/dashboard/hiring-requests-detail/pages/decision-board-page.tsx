import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import DecisionBoard from "@/app/dashboard/hiring-requests-detail/components/decision-board/decision-board";
import { useHiringRequestHeader } from "@/app/dashboard/hiring-requests-detail/pages/use-hiring-request-header";
import type { HiringRequestContext } from "./hiring-request-layout";

const DecisionBoardPage = () => {
  const { data } = useOutletContext<HiringRequestContext>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const headerConfig = useHiringRequestHeader({
    id,
    data,
    activeView: "board",
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
    </>
  );
};

export default DecisionBoardPage;
