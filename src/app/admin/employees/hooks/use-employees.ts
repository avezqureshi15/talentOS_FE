import { useRef, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/constants";
import { getEmployees } from "@/app/admin/employees/services/employees.service";
import {
  EMPLOYEES_PAGE_PER_PAGE,
  EMPLOYEES_SEARCH_DEBOUNCE_MS,
} from "@/app/admin/employees/pages/employees-page.constants";
import type { PaginatedEmployees } from "@/app/admin/employees/pages/employees-page.types";

type UseEmployeesResult = {
  data: PaginatedEmployees | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isRefetching: boolean;
  isError: boolean;
  page: number;
  search: string;
  setPage: (page: number) => void;
  onSearch: (value: string) => void;
  refetch: () => void;
};

export function useEmployees(): UseEmployeesResult {
  // UI-only state: search input, current page, and debounced query used for
  // the actual fetch. Server state itself lives in TanStack Query below.
  const [search, setSearch] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const query = useQuery({
    queryKey: [QUERY_KEYS.EMPLOYEES, page, debouncedQ],
    queryFn: () =>
      getEmployees({
        page,
        per_page: EMPLOYEES_PAGE_PER_PAGE,
        q: debouncedQ || undefined,
      }).then((res) => res.data),
    placeholderData: keepPreviousData,
  });

  const onSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQ(value), EMPLOYEES_SEARCH_DEBOUNCE_MS);
  };

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    isError: query.isError,
    page,
    search,
    setPage,
    onSearch,
    refetch: () => void query.refetch(),
  };
}
