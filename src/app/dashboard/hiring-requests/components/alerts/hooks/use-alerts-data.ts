import { useCallback, useMemo, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAlerts } from "@/services/alerts/alerts";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import { PAGINATION } from "@/constants/api-endpoints";
import httpClient from "@/services/http-client";
import type { AlertsApiResponse, AlertApiItem } from "@/services/alerts/alerts.types";
import type { AlertsSubTab } from "../../../pages/hiring-requests.types";

type UseAlertsResult = {
  alerts: AlertApiItem[];
  total: number;
  hasMore: boolean;
  isLoading: boolean;
  isFetching: boolean;
  page: number;
  setPage: (page: number) => void;
  refresh: () => void;
  resolveAlert: (alertId: string) => void;
  isResolving: boolean;
};

const PER_PAGE = PAGINATION.INTERVIEWS_PER_PAGE;

export function useAlertsData(sub: AlertsSubTab): UseAlertsResult {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const type = sub === "reviews" ? "reviews" : "slots";

  const query = useQuery({
    queryKey: [QUERY_KEYS.ALERTS, type, page],
    queryFn: () => fetchAlerts(type, page, PER_PAGE, false),
    placeholderData: keepPreviousData,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
  });

  const mutation = useMutation({
    mutationFn: (alertId: string) => httpClient.patch(`/alerts/${alertId}/read`),
    onMutate: async (alertId) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.ALERTS] });
      const previous = queryClient.getQueriesData<AlertsApiResponse>({ queryKey: [QUERY_KEYS.ALERTS] });
      queryClient.setQueriesData({ queryKey: [QUERY_KEYS.ALERTS] }, (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        const data = old as AlertsApiResponse;
        if (!data.data?.alerts) return old;
        return {
          ...data,
          data: {
            ...data.data,
            alerts: data.data.alerts.filter((a) => a.id !== alertId),
          },
        };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        for (const [key, data] of context.previous) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALERTS] });
    },
  });

  const alerts = useMemo<AlertApiItem[]>(
    () => query.data?.data.alerts ?? [],
    [query.data],
  );

  const total = query.data?.data.pagination.total_records ?? 0;
  const hasMore = query.data?.data.pagination.has_more ?? false;

  return {
    alerts,
    total,
    hasMore,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    page,
    setPage: useCallback((p: number) => setPage(p), []),
    refresh: query.refetch,
    resolveAlert: useCallback((alertId: string) => mutation.mutate(alertId), [mutation]),
    isResolving: mutation.isPending,
  };
}
