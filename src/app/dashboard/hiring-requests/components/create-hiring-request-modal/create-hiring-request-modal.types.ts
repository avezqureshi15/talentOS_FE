import type { HiringRequestCreatePayload } from "@/services/hiring-requests/hiring-requests.types";

export type CreateHiringRequestFormValues = {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  benefits: string;
  custom_evaluation_criteria: string;
  is_active: boolean;
};

export type CreateHiringRequestFormErrors = Partial<
  Record<keyof Omit<CreateHiringRequestFormValues, "is_active">, string>
>;

export type CreateHiringRequestModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
};

export type { HiringRequestCreatePayload };
