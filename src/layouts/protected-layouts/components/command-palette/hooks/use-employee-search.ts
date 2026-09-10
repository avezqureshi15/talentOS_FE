import { useInfiniteQuery } from "@tanstack/react-query";
import { PAGINATION } from "@/constants/api-endpoints";
import { searchEmployees } from "@/layouts/protected-layouts/components/command-palette/services/command-palette.service";

export const useEmployeeSearch = (q: string) => {
  return useInfiniteQuery({
    queryKey: ["employee-search", q],
    queryFn: ({ pageParam }) =>
      searchEmployees(q, pageParam, PAGINATION.DEFAULT_CMD_PALETTE_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.page + 1 : undefined,
    enabled: !!q.trim(),
    staleTime: 30_000,
    select: (data) => data.pages.flatMap((p) => p.data),
  });
};
