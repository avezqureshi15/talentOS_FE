import { useState } from "react";
import DataTable from "@/components/ui/data-table/data-table";
import type { Invite } from "@/app/admin/users/services/users-admin.service";
import { ROLE_DISPLAY } from "@/constants/role-display";
import type { InvitesTableProps } from "./invites-table.types";

export default function InvitesTable({ invites, loading, onRevoke }: InvitesTableProps) {
  const [revokingId, setRevokingId] = useState<number | null>(null);

  const handleRevoke = async (id: number) => {
    setRevokingId(id);
    try {
      await onRevoke(id);
    } finally {
      setRevokingId(null);
    }
  };

  const daysRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days}d left` : "Expired";
  };

  return (
    <DataTable
      columns={[
        { header: "#", render: (_, i) => <span style={{ color: "var(--text-faint)" }}>{i + 1}</span> },
        { header: "Email", render: (inv: Invite) => inv.email },
        {
          header: "Role",
          render: (inv: Invite) => {
            const display = ROLE_DISPLAY[inv.role] ?? { chipVariant: "neutral", label: inv.role };
            return <span className={`dt-chip dt-chip--${display.chipVariant}`}>{display.label}</span>;
          },
        },
        {
          header: "Status",
          render: (inv: Invite) => (
            <span style={{ color: inv.accepted_at ? "var(--text-muted)" : "var(--accent)", fontSize: 12 }}>
              {inv.accepted_at ? "Accepted" : "Pending"}
            </span>
          ),
        },
        {
          header: "Expires",
          render: (inv: Invite) => (
            <span className="dt-cell-muted">{daysRemaining(inv.expires_at)}</span>
          ),
        },
        {
          header: "",
          render: (inv: Invite) =>
            !inv.accepted_at ? (
              <button
                onClick={() => handleRevoke(inv.id)}
                disabled={revokingId === inv.id}
                className="dt-btn-link"
              >
                {revokingId === inv.id ? "..." : "Revoke"}
              </button>
            ) : null,
        },
      ]}
      data={invites}
      loading={loading}
      keyExtractor={(inv) => inv.id}
      emptyMessage="No pending invites"
      gridTemplateColumns="40px 2fr 1fr 1fr 1fr 100px"
    />
  );
}
