import type { HiringRequest } from "@/services/hiring-requests/hiring-requests.types";

export type HiringRequestsTableProps = {
  data: HiringRequest[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
};
