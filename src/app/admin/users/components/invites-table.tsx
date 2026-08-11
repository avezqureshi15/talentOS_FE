import { useState } from "react";
import DataTable from "@/components/ui/data-table/data-table";
import { TruncatedCell } from "@/components/shared/truncated-cell/truncated-cell";
import type { Invite } from "@/app/admin/users/services/users-admin.service";
import { ROLE_DISPLAY } from "@/constants/role-display";
import { APP_URL } from "@/constants/constants";
import type { InvitesTableProps } from "./invites-table.types";
import "./invites-table.css";

export default function InvitesTable({ invites, loading, onRevoke }: InvitesTableProps) {
  const [revokingId, setRevokingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleRevoke = async (id: number) => {
    setRevokingId(id);
    try {
      await onRevoke(id);
    } finally {
      setRevokingId(null);
    }
  };

  const getInviteLink = (token: string) => `${APP_URL}/auth/invite/${token}`;

  const handleCopy = async (inv: Invite) => {
    try {
      await navigator.clipboard.writeText(getInviteLink(inv.token));
      setCopiedId(inv.id);
      setTimeout(() => setCopiedId((id) => (id === inv.id ? null : id)), 2000);
    } catch {
      /* clipboard not available */
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
        { header: "Email", render: (inv: Invite) => <TruncatedCell text={inv.email} /> },
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
          header: "Invite Link",
          className: "invite-link-cell-wrap",
          render: (inv: Invite) => {
            const link = getInviteLink(inv.token);
            return (
              <div className="invite-link-cell">
                <TruncatedCell text={link} className="invite-link-text" />
                <button
                  type="button"
                  className={`invite-copy-btn${copiedId === inv.id ? " invite-copy-btn--copied" : ""}`}
                  title={copiedId === inv.id ? "Copied" : "Copy invite link"}
                  onClick={() => handleCopy(inv)}
                >
                  {copiedId === inv.id ? <i className="bx bx-check" /> : <i className="bx bx-copy" />}
                </button>
              </div>
            );
          },
        },
        {
          header: "",
          render: (inv: Invite) =>
            !inv.accepted_at ? (
              <button
                onClick={() => handleRevoke(inv.id)}
                disabled={revokingId === inv.id}
                className={`dt-btn-link invite-revoke-btn${
                  revokingId === inv.id ? " invite-revoke-btn--loading" : ""
                }`}
              >
                {revokingId === inv.id ? (
                  <i className="bx bx-loader-alt bx-spin" />
                ) : (
                  "Revoke"
                )}
              </button>
            ) : null,
        },
      ]}
      data={invites}
      loading={loading}
      keyExtractor={(inv) => inv.id}
      emptyMessage="No pending invites"
      gridTemplateColumns="40px 1.6fr 1fr 0.9fr 1fr 2.2fr 90px"
    />
  );
}
