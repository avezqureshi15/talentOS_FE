import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import JobDetail from "@/app/dashboard/hiring-requests-detail/components/detail/detail";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorFallback from "@/components/ui/error-fallback/error-fallback";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import { useHiringRequest } from "@/app/dashboard/hiring-requests/hooks/use-hiring-requests";
import { useExportExcel } from "@/app/dashboard/hiring-requests-detail/components/detail/use-export-excel";
import { fetchApplicationsPaginated } from "@/services/applications/applications";
import { useHeaderStore } from "@/store/header.store";
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

const HiringRequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useHiringRequest(id);

  // justification: fetches total applicant count for the counter pill in the header toolbar
  const { data: totalCount } = useQuery({
    queryKey: [QUERY_KEYS.APPLICATIONS, "count", id],
    queryFn: () => fetchApplicationsPaginated(id!, undefined, undefined, undefined, undefined, undefined, 1, 0),
    enabled: !!id,
    select: (data) => data.total,
  });

  const { handleExport, isExporting } = useExportExcel(id ?? "", HEADER_EXPORT_FILENAME);

  const setConfig = useHeaderStore((s) => s.setConfig);
  const clearConfig = useHeaderStore((s) => s.clearConfig);

  // justification: registers the job applications toolbar config in the global header store on mount and clears on unmount
  useEffect(() => {
    if (!id || !data) return;
    setConfig({
      title: "Applications",
      totalCount,
      search: {
        placeholder: HEADER_SEARCH_PLACEHOLDER,
        shortcut: HEADER_SEARCH_SHORTCUT,
      },
      viewSwitcher: {
        options: [...HEADER_VIEW_OPTIONS],
        active: HEADER_DEFAULT_VIEW,
        onChange: (_key: string) => {
          // future: wire to view logic
        },
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
        },
        {
          key: "add-candidate",
          label: HEADER_ADD_CANDIDATE_LABEL,
          icon: HEADER_ADD_CANDIDATE_ICON,
          variant: "primary",
        },
      ],
    });
    return () => clearConfig();
  }, [id, data, totalCount, handleExport, isExporting, setConfig, clearConfig]);

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  if (error) {
    return <ErrorFallback message={error.message} onRetry={() => refetch()} />;
  }

  if (!data) {
    return null;
  }

  return (
    <ErrorBoundary>
      <JobDetail hiringRequest={data} />
    </ErrorBoundary>
  );
};

export default HiringRequestDetails;
