import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import JobDetail from "@/app/dashboard/hiring-requests-detail/components/detail/detail";
import { useHiringRequestHeader } from "@/app/dashboard/hiring-requests-detail/pages/use-hiring-request-header";
import { HEADER_DEFAULT_VIEW } from "@/layouts/protected-layouts/components/header/header.constants";
import type { HiringRequestContext } from "./hiring-request-layout";

const ApplicationsPage = () => {
  const { data } = useOutletContext<HiringRequestContext>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const headerConfig = useHiringRequestHeader({
    id,
    data,
    activeView: HEADER_DEFAULT_VIEW,
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
    </>
  );
};

export default ApplicationsPage;
