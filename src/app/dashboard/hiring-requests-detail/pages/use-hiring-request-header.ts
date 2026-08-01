import { useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApplicationsPaginated } from "@/services/applications/applications";
import { QUERY_KEYS, EXPORT_LABELS } from "@/constants/constants";
import { useExportExcel } from "@/app/dashboard/hiring-requests-detail/components/detail/use-export-excel";
import {
  HEADER_VIEW_OPTIONS,
  HEADER_EXPORT_LABEL, HEADER_EXPORT_ICON,
  HEADER_REFRESH_LABEL, HEADER_REFRESH_ICON, HEADER_EXPORT_FILENAME,
} from "@/layouts/protected-layouts/components/header/header.constants";
import type { HeaderBadge, HeaderConfig } from "@/store/header.store";
import type { HiringRequest } from "@/services/hiring-requests/hiring-requests.types";

type UseHiringRequestHeaderOptions = {
  id: string | undefined;
  data: HiringRequest;
  activeView: string;
  onViewChange: (key: string) => void;
  badge?: HeaderBadge;
};

export function useHiringRequestHeader({
  id,
  data,
  activeView,
  onViewChange,
  badge,
}: UseHiringRequestHeaderOptions): HeaderConfig {
  const { data: totalCount } = useQuery({
    queryKey: [QUERY_KEYS.APPLICATIONS, "count", id],
    queryFn: () => fetchApplicationsPaginated(id!, undefined, undefined, undefined, undefined, undefined, 1, 0),
    enabled: !!id,
    select: (d) => d.total,
  });

  const { handleExport, isExporting, exportError } = useExportExcel(id ?? "", HEADER_EXPORT_FILENAME);
  const queryClient = useQueryClient();
  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HIRING_REQUEST] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPLICATIONS] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FINAL_VERDICTS] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INTERVIEWS] });
  }, [queryClient]);

  return useMemo(() => ({
    title: "Applications",
    totalCount,
    hiringRequestName: data.title,
    hiringRequest: data,
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
      { key: "refresh", label: HEADER_REFRESH_LABEL, icon: HEADER_REFRESH_ICON, variant: "primary", onClick: handleRefresh },
    ],
    badge,
  }), [totalCount, handleExport, isExporting, exportError, handleRefresh, data, activeView, onViewChange, badge]);
}
