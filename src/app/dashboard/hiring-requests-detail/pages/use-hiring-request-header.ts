import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchApplicationsPaginated } from "@/services/applications/applications";
import { QUERY_KEYS, EXPORT_LABELS } from "@/constants/constants";
import { useExportExcel } from "@/app/dashboard/hiring-requests-detail/components/detail/use-export-excel";
import {
  HEADER_SEARCH_PLACEHOLDER, HEADER_SEARCH_SHORTCUT, HEADER_VIEW_OPTIONS,
  HEADER_EXPORT_LABEL, HEADER_EXPORT_ICON,
  HEADER_ADD_CANDIDATE_LABEL, HEADER_ADD_CANDIDATE_ICON, HEADER_EXPORT_FILENAME,
} from "@/layouts/protected-layouts/components/header/header.constants";
import type { HeaderConfig } from "@/store/header.store";
import type { HiringRequest } from "@/services/hiring-requests/hiring-requests.types";

type UseHiringRequestHeaderOptions = {
  id: string | undefined;
  data: HiringRequest;
  activeView: string;
  onViewChange: (key: string) => void;
};

export function useHiringRequestHeader({
  id,
  data,
  activeView,
  onViewChange,
}: UseHiringRequestHeaderOptions): HeaderConfig {
  const { data: totalCount } = useQuery({
    queryKey: [QUERY_KEYS.APPLICATIONS, "count", id],
    queryFn: () => fetchApplicationsPaginated(id!, undefined, undefined, undefined, undefined, undefined, 1, 0),
    enabled: !!id,
    select: (d) => d.total,
  });

  const { handleExport, isExporting, exportError } = useExportExcel(id ?? "", HEADER_EXPORT_FILENAME);

  return useMemo(() => ({
    title: "Applications",
    totalCount,
    hiringRequestName: data.title,
    hiringRequest: data,
    search: { placeholder: HEADER_SEARCH_PLACEHOLDER, shortcut: HEADER_SEARCH_SHORTCUT },
    viewSwitcher: {
      options: [...HEADER_VIEW_OPTIONS],
      active: activeView,
      onChange: onViewChange,
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
      { key: "add-candidate", label: HEADER_ADD_CANDIDATE_LABEL, icon: HEADER_ADD_CANDIDATE_ICON, variant: "primary" },
    ],
  }), [totalCount, handleExport, isExporting, exportError, data, activeView, onViewChange]);
}
