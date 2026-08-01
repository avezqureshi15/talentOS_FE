import type { JobTeamMember } from "./team-members.types";
import { TEAM_MEMBERS_LABELS } from "./team-members.constants";
import "./team-member-row.css";

type Props = {
  member: JobTeamMember;
  onToggleOwner: (member: JobTeamMember) => void;
  onRemove: (member: JobTeamMember) => void;
  manageable: boolean;
  busy: boolean;
};

export default function TeamMemberRow({ member, onToggleOwner, onRemove, manageable, busy }: Props) {
  return (
    <tr className="tm-row">
      <td className="tm-td-member">
        <div className="tm-member-cell">
          <div className="tm-avatar">{member.name.charAt(0).toUpperCase()}</div>
          <div className="tm-member-info">
            <span className="tm-member-name">{member.name}</span>
            <span className="tm-member-email">{member.email}</span>
          </div>
        </div>
      </td>
      <td className="tm-td-role">
        <span className={`tm-role-badge tm-role-badge--${member.is_owner ? "owner" : "member"}`}>
          {member.is_owner ? TEAM_MEMBERS_LABELS.OWNER_BADGE : TEAM_MEMBERS_LABELS.MEMBER_BADGE}
        </span>
      </td>
      {manageable && (
        <td className="tm-td-actions">
          <button
            type="button"
            className="tm-action-btn"
            title={member.is_owner ? "Remove owner role" : "Make owner"}
            disabled={busy}
            onClick={() => onToggleOwner(member)}
          >
            <i className={`bx ${member.is_owner ? "bx-user-x" : "bx-user-check"}`} />
          </button>
          <button
            type="button"
            className="tm-action-btn tm-action-btn--danger"
            title="Remove from team"
            disabled={busy}
            onClick={() => onRemove(member)}
          >
            <i className="bx bx-trash" />
          </button>
        </td>
      )}
    </tr>
  );
}
