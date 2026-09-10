import type { UserItem } from "@/services/users/users";

/** Which UI surface the modal presents:
 * - "email-only"           — legacy form, plain email field (superadmin path).
 * - "existing-and-email"   — segmented tabs: Existing Employee + Manual Email.
 */
export type InviteMode = "email-only" | "existing-and-email";

export type InviteTab = "existing" | "manual";

export type InviteUserModalProps = {
  onClose: () => void;
  onSuccess: () => void;
  tenantId?: number;
  mode?: InviteMode;
};

export type SelectedEmployee = Pick<UserItem, "id" | "email" | "name" | "designation" | "emp_id">;
