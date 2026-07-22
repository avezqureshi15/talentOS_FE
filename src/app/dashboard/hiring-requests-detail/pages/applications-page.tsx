import { useMemo } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import JobDetail from "@/app/dashboard/hiring-requests-detail/components/detail/detail";
import { useExportCsv } from "@/app/dashboard/hiring-requests-detail/components/detail/use-export-csv";
import { fetchApplicationsPaginated } from "@/services/applications/applications";
import { QUERY_KEYS, EXPORT_LABELS } from "@/constants/constants";
import {
  HEADER_SEARCH_PLACEHOLDER,
  HEADER_SEARCH_SHORTCUT,
  HEADER_VIEW_OPTIONS,
  HEADER_DEFAULT_VIEW,
  HEADER_EXPORT_LABEL,
  HEADER_EXPORT_ICON,
  HEADER_ADD_CANDIDATE_LABEL,
  HEADER_ADD_CANDIDATE_ICON,
  HEADER_EXPORT_FILENAME,
} from "@/layouts/protected-layouts/components/header/header.constants";
import type { HeaderConfig } from "@/store/header.store";
import type { HiringRequestContext } from "./hiring-request-layout";

const ApplicationsPage = () => {
  const { data } = useOutletContext<HiringRequestContext>();
  const { id } = useParams<{ id: string }>();

  const { data: totalCount } = useQuery({
    queryKey: [QUERY_KEYS.APPLICATIONS, "count", id],
    queryFn: () => fetchApplicationsPaginated(id!, undefined, undefined, undefined, undefined, undefined, 1, 0),
    enabled: !!id,
    select: (d) => d.total,
  });

  const { handleExport, isExporting, exportError } = useExportCsv(id ?? "", HEADER_EXPORT_FILENAME);

  const headerConfig: HeaderConfig = useMemo(() => ({
    title: "Applications",
    totalCount,
    search: {
      placeholder: HEADER_SEARCH_PLACEHOLDER,
      shortcut: HEADER_SEARCH_SHORTCUT,
    },
    viewSwitcher: {
      options: [...HEADER_VIEW_OPTIONS],
      active: HEADER_DEFAULT_VIEW,
      onChange: () => {},
    },
    actions: [
      {
        key: "export",
        label: HEADER_EXPORT_LABEL,
        icon: HEADER_EXPORT_ICON,
        iconPosition: "right",
        onClick: handleExport,
        loading: isExporting,
        loadingText: EXPORT_LABELS.DOWNLOADING,
        error: exportError,
      },
      {
        key: "add-candidate",
        label: HEADER_ADD_CANDIDATE_LABEL,
        icon: HEADER_ADD_CANDIDATE_ICON,
        variant: "primary",
      },
    ],
  }), [totalCount, handleExport, isExporting, exportError]);

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
