import type { HiringRequest } from "@/services/hiring-requests/hiring-requests.types";

export type JdDetailModalProps = {
  open: boolean;
  onClose: () => void;
  hiringRequest: HiringRequest;
};
