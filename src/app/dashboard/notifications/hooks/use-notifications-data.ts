import { useCallback, useMemo } from "react";
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchNotifications,
  markNotificationRead,
} from "@/services/notifications/notifications";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants/constants";
import { PAGINATION } from "@/constants/api-endpoints";
import { NOTIFICATION_TABS, NOTIFICATION_TAB_TYPES } from "@/services/notifications/notification.meta";
import type { NotificationsApiResponse, NotificationApiItem } from "@/services/notifications/notifications.types";
import type { NotificationTab } from "@/services/notifications/notification.meta";

type UseNotificationsResult = {
  notifications: NotificationApiItem[];
  hasMore: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  loadMore: () => void;
  refresh: () => void;
  markRead: (notificationId: string) => void;
  isMarking: boolean;
  tabCounts: Record<NotificationTab, number>;
};

const PER_PAGE = PAGINATION.INTERVIEWS_PER_PAGE;

function tabQueryArgs(tab: NotificationTab) {
  if (tab === "all") return {};
  const t = NOTIFICATION_TAB_TYPES[tab];
  return {
    types: t.include.length ? t.include : undefined,
    excludeTypes: t.exclude.length ? t.exclude : undefined,
  };
}

function optimisticRead(old: unknown, notificationId: string) {
  if (!old || typeof old !== "object" || !("pages" in old)) return old;
  const inf = old as { pages: NotificationsApiResponse[]; pageParams: unknown[] };
  return {
    ...inf,
    pages: inf.pages.map((page) => ({
      ...page,
      data: {
        ...page.data,
        notifications: page.data.notifications.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n,
        ),
      },
    })),
  };
}

export function useNotificationsData(tab: NotificationTab): UseNotificationsResult {
  const query = useInfiniteQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, tab],
    queryFn: ({ pageParam }) =>
      fetchNotifications({ page: pageParam, perPage: PER_PAGE, ...tabQueryArgs(tab) }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.data.pagination.has_more ? last.data.pagination.current_page + 1 : undefined,
    placeholderData: keepPreviousData,
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
  });

  const countQueries = useQueries({
    queries: NOTIFICATION_TABS.map((t) => ({
      queryKey: [QUERY_KEYS.NOTIFICATIONS, "count", t.key],
      queryFn: () =>
        fetchNotifications({ page: 1, perPage: 1, isRead: false, ...tabQueryArgs(t.key) }),
      select: (d: NotificationsApiResponse) => d.data.pagination.total_records,
      staleTime: 15_000,
      retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    })),
  });

  const tabCounts = useMemo(() => {
    const counts = {} as Record<NotificationTab, number>;
    NOTIFICATION_TABS.forEach((t, i) => {
      counts[t.key] = countQueries[i].data ?? 0;
    });
    return counts;
  }, [countQueries]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (notificationId: string) => markNotificationRead(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
      const previous = queryClient.getQueriesData({
        queryKey: [QUERY_KEYS.NOTIFICATIONS],
      });
      queryClient.setQueriesData({ queryKey: [QUERY_KEYS.NOTIFICATIONS] }, (old) =>
        optimisticRead(old, notificationId),
      );
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });

  const notifications = useMemo<NotificationApiItem[]>(
    () => query.data?.pages.flatMap((p) => p.data.notifications) ?? [],
    [query.data],
  );

  return {
    notifications,
    hasMore: query.hasNextPage ?? false,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    loadMore: useCallback(() => void query.fetchNextPage(), [query]),
    refresh: query.refetch,
    markRead: useCallback((notificationId: string) => mutation.mutate(notificationId), [mutation]),
    isMarking: mutation.isPending,
    tabCounts,
  };
}
