import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/constants";
import { getEmployee } from "@/app/admin/employees/services/employees.service";

export function useEmployeeDetail(empId: string | undefined) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.EMPLOYEES, "detail", empId],
    queryFn: () => getEmployee(empId as string).then((res) => res.data),
    enabled: !!empId,
  });
  return {
    employee: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: () => void query.refetch(),
  };
}
