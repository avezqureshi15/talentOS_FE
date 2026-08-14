import { useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApplicationsPaginated } from "@/services/applications/applications";
import { QUERY_KEYS, EXPORT_LABELS } from "@/constants/constants";
import { PERMISSIONS } from "@/constants/permissions";
import { usePermissions } from "@/hooks/use-permissions";
import { useExportExcel } from "@/app/dashboard/hiring-requests-detail/components/detail/use-export-excel";
import {
  HEADER_VIEW_OPTIONS,
  HEADER_EXPORT_LABEL, HEADER_EXPORT_ICON, HEADER_EXPORT_TOOLTIP,
  HEADER_IMPORT_LABEL, HEADER_IMPORT_ICON, HEADER_IMPORT_TOOLTIP,
  HEADER_REFRESH_LABEL, HEADER_REFRESH_ICON, HEADER_EXPORT_FILENAME,
  HEADER_ARCHIVE_LABEL, HEADER_ARCHIVE_ICON, HEADER_ARCHIVE_TOOLTIP,
  HEADER_CLOSE_JOB_LABEL, HEADER_CLOSE_JOB_ICON, HEADER_CLOSE_JOB_TOOLTIP,
  HEADER_REOPEN_JOB_LABEL, HEADER_REOPEN_JOB_ICON, HEADER_REOPEN_JOB_TOOLTIP,
} from "@/layouts/protected-layouts/components/header/header.constants";
import type { HeaderBadge, HeaderConfig } from "@/store/header.store";
import type { HiringRequest } from "@/services/hiring-requests/hiring-requests.types";

type UseHiringRequestHeaderOptions = {
  id: string | undefined;
  data: HiringRequest;
  activeView: string;
  onViewChange: (key: string) => void;
  badge?: HeaderBadge;
  badges?: HeaderBadge[];
  onImport?: () => void;
  onArchived?: () => void;
  onCloseJob?: () => void;
  isJobClosing?: boolean;
  title?: string;
  titleIcon?: string;
  subtitle?: string;
  totalCount?: number;
  onBack?: () => void;
};

export function useHiringRequestHeader({
  id,
  data,
  activeView,
  onViewChange,
  badge,
  badges,
  onImport,
  onArchived,
  onCloseJob,
  title,
  titleIcon,
  subtitle,
  totalCount: totalCountOverride,
  onBack,
}: UseHiringRequestHeaderOptions): HeaderConfig {
  const { can } = usePermissions();
  const canImport = can(PERMISSIONS.APPLICATION_WORKFLOW);
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
    title: title ?? "Applications",
    titleIcon,
    subtitle,
    onBack,
    totalCount: totalCountOverride ?? totalCount,
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
        tooltipLines: HEADER_EXPORT_TOOLTIP,
        onClick: handleExport,
        loading: isExporting,
        loadingText: EXPORT_LABELS.DOWNLOADING,
        error: exportError,
      },
      ...(canImport && onImport
        ? [{ key: "import", label: HEADER_IMPORT_LABEL, icon: HEADER_IMPORT_ICON, variant: "primary" as const, tooltipLines: HEADER_IMPORT_TOOLTIP, onClick: onImport }]
        : []),
      ...(canImport && onArchived
        ? [{ key: "archive", label: HEADER_ARCHIVE_LABEL, icon: HEADER_ARCHIVE_ICON, variant: "primary" as const, tooltipLines: HEADER_ARCHIVE_TOOLTIP, onClick: onArchived }]
        : []),
      ...(onCloseJob
        ? [{
            key: "close-job",
            label: data.is_active ? HEADER_CLOSE_JOB_LABEL : HEADER_REOPEN_JOB_LABEL,
            icon: data.is_active ? HEADER_CLOSE_JOB_ICON : HEADER_REOPEN_JOB_ICON,
            tooltipLines: data.is_active ? HEADER_CLOSE_JOB_TOOLTIP : HEADER_REOPEN_JOB_TOOLTIP,
            className: data.is_active ? "header-more-item--danger" : undefined,
            onClick: onCloseJob,
          }]
        : []),
      { key: "refresh", label: HEADER_REFRESH_LABEL, icon: HEADER_REFRESH_ICON, variant: "primary", onClick: handleRefresh },
    ],
    badge,
    badges,
  }), [totalCount, totalCountOverride, handleExport, isExporting, exportError, handleRefresh, data, activeView, onViewChange, badge, badges, canImport, onImport, onArchived, onCloseJob, title, titleIcon, subtitle, onBack]);
}
