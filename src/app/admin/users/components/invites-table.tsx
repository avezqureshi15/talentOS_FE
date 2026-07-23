import { useState } from "react";
import type { Invite } from "@/app/admin/users/services/users-admin.service";

type Props = {
  invites: Invite[];
  loading: boolean;
  onRevoke: (id: number) => void;
};

const ROLE_CHIP: Record<string, string> = {
  admin: "info",
  hr: "success",
  viewer: "neutral",
};

export default function InvitesTable({ invites, loading, onRevoke }: Props) {
  const [revokingId, setRevokingId] = useState<number | null>(null);

  const handleRevoke = async (id: number) => {
    setRevokingId(id);
    try {
      await onRevoke(id);
    } finally {
      setRevokingId(null);
    }
  };

  if (loading) {
    return <div className="invites-table-loading">Loading invites...</div>;
  }

  if (invites.length === 0) {
    return <div className="invites-table-empty">No pending invites</div>;
  }

  const daysRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days}d left` : "Expired";
  };

  return (
    <div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Expires</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invites.map((inv, i) => (
            <tr key={inv.id}>
              <td style={tdStyle}><span style={{ color: "var(--text-faint)" }}>{i + 1}</span></td>
              <td style={tdStyle}>{inv.email}</td>
              <td style={tdStyle}>
                <span style={chipStyles(ROLE_CHIP[inv.role] || "neutral")}>{inv.role}</span>
              </td>
              <td style={tdStyle}>
                <span style={{ color: inv.accepted_at ? "var(--text-muted)" : "var(--accent)", fontSize: 12 }}>
                  {inv.accepted_at ? "Accepted" : "Pending"}
                </span>
              </td>
              <td style={{ ...tdStyle, color: "var(--text-muted)", fontSize: 12 }}>
                {daysRemaining(inv.expires_at)}
              </td>
              <td style={tdStyle}>
                {!inv.accepted_at && (
                  <button
                    onClick={() => handleRevoke(inv.id)}
                    disabled={revokingId === inv.id}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      border: "1px solid var(--border-subtle)",
                      background: "transparent",
                      color: "var(--danger)",
                      fontSize: 12,
                      fontFamily: "var(--font-family)",
                      cursor: "pointer",
                    }}
                  >
                    {revokingId === inv.id ? "..." : "Revoke"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 16px",
  color: "var(--text-muted)",
  fontWeight: 500,
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  borderBottom: "1px solid var(--border-subtle)",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 16px",
  borderBottom: "1px solid var(--border-subtle)",
  color: "var(--text-primary)",
};

const chipStyles = (variant: string): React.CSSProperties => {
  const colors: Record<string, { bg: string; color: string }> = {
    info: { bg: "rgba(100, 181, 246, 0.15)", color: "#64b5f6" },
    success: { bg: "rgba(129, 199, 132, 0.15)", color: "#81c784" },
    neutral: { bg: "rgba(158, 158, 158, 0.15)", color: "#9e9e9e" },
  };
  const c = colors[variant] || colors.neutral;
  return {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    textTransform: "capitalize",
    background: c.bg,
    color: c.color,
  };
};
