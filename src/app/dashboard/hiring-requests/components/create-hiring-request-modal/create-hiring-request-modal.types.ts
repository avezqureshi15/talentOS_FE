import type { HiringRequestCreatePayload } from "@/services/hiring-requests/hiring-requests.types";
import type { UserItem } from "@/services/users/users";

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

export type CreateHiringRequestStep = 1 | 2 | 3;

export type AssignMode = "assign" | "skip" | null;

export type TeamAssignment = {
  user: UserItem;
};

export type { HiringRequestCreatePayload };
