import { useInfiniteQuery } from "@tanstack/react-query";
import { PAGINATION } from "@/constants/api-endpoints";
import { searchHiringRequests } from "@/components/ui/command-palette/services/command-palette.service";
import type { HiringRequest } from "@/services/hiring-requests/hiring-requests.types";

export const useHiringSearch = (q: string) => {
  return useInfiniteQuery({
    queryKey: ["hiring-search", q],
    queryFn: ({ pageParam }) =>
      searchHiringRequests(q, pageParam, PAGINATION.DEFAULT_CMD_PALETTE_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.page + 1 : undefined,
    enabled: !!q.trim(),
    staleTime: 30_000,
    select: (data) => data.pages.flatMap((p) => p.data),
  });
};
