import type { Invite } from "@/app/admin/users/services/users-admin.service";

export type InvitesTableProps = {
  invites: Invite[];
  loading: boolean;
  onRevoke: (id: number) => void;
};
