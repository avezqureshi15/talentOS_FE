import { useEffect, useMemo, useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import { fetchSystemUsers, type UserItem } from "@/services/users/users";
import { useAuth } from "@/app/auth/hooks/use-auth";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import { ROLE_DISPLAY } from "@/constants/role-display";
import {
  useAddTeamMember,
  useJobTeam,
} from "@/app/dashboard/hiring-requests-detail/components/team-members/use-team-members";
import type { HiringRequest } from "@/services/hiring-requests/hiring-requests.types";
import { ASSIGN_MEMBER_MODAL } from "./assign-member-modal.constants";
import { PersonAvatar } from "@/components/shared/person-avatar/person-avatar";
import "./assign-member-modal.css";

type Props = {
  job: HiringRequest;
  onClose: () => void;
};

export default function AssignMemberModal({ job, onClose }: Props) {
  const { user } = useAuth();
  const { data: team } = useJobTeam(job.id);
  const addMutation = useAddTeamMember(job.id);

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [usersStatus, setUsersStatus] = useState<"idle" | "loading" | "ready">("idle");
  const [selected, setSelected] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadingUsers = usersStatus === "loading";

  const memberIds = useMemo(() => new Set(team?.data.map((m) => m.user_id) ?? []), [team]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setUsersStatus("loading");
  };

  useEffect(() => {
    let cancelled = false;
    fetchSystemUsers(search.trim() || undefined, 1, 100)
      .then((data) => {
        if (!cancelled) {
          setUsers(data.data);
          setUsersStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUsers([]);
          setUsersStatus("ready");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [search]);

  const candidates = users.filter((u) => u.id !== user?.id);

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleAssign = async () => {
    if (busy || selected.length === 0) return;
    setBusy(true);
    setError("");
    let failed = 0;
    const userMap = new Map(users.map((u) => [u.id, u]));
    for (const userId of selected) {
      const u = userMap.get(userId);
      try {
        await addMutation.mutateAsync({
          user_id: u?.employee_id ?? userId,
          is_owner: false,
        });
      } catch {
        failed += 1;
      }
    }
    const ok = selected.length - failed;
    if (failed === 0) {
      useToastStore
        .getState()
        .addToast(ASSIGN_MEMBER_MODAL.SUCCESS(ok), ToastType.SUCCESS);
    } else {
      useToastStore
        .getState()
        .addToast(ASSIGN_MEMBER_MODAL.PARTIAL(ok, failed), ToastType.ERROR);
    }
    onClose();
  };

  return (
    <BaseModal
      open
      onClose={onClose}
      title={ASSIGN_MEMBER_MODAL.TITLE}
      icon="bx bx-user-plus"
      className="assign-member-modal"
    >
      <div className="am-body">
        <div className="am-job">
          <span className="am-job-title">{job.title}</span>
          <span className="am-job-hint">{ASSIGN_MEMBER_MODAL.JOB_HINT}</span>
        </div>

        <div className="am-controls">
          <div className="am-field">
            <label className="am-label">{ASSIGN_MEMBER_MODAL.SEARCH_LABEL}</label>
            <input
              type="text"
              className="am-input"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={ASSIGN_MEMBER_MODAL.SEARCH_PLACEHOLDER}
            />
          </div>
        </div>

        {loadingUsers && <p className="am-hint">{ASSIGN_MEMBER_MODAL.LOADING}</p>}
        {!loadingUsers && candidates.length === 0 && (
          <p className="am-hint">{ASSIGN_MEMBER_MODAL.EMPTY}</p>
        )}

        <div className="am-list">
          {candidates.map((u) => {
            const isMember = memberIds.has(u.id);
            const disabled = isMember;
            return (
              <div
                key={u.id}
                className={`am-row${selected.includes(u.id) ? " am-row--selected" : ""}`}
              >
                <input
                  type="checkbox"
                  className="am-check"
                  checked={selected.includes(u.id)}
                  disabled={disabled}
                  onChange={() => toggle(u.id)}
                />
                <PersonAvatar
                  className="am-avatar"
                  person={{ name: u.name, email: u.email, designation: u.designation || undefined }}
                />
                <span className="am-info">
                  <span className="am-name-row">
                    <span className="am-name">{u.name}</span>
                    <span className="am-primary-role" title={ASSIGN_MEMBER_MODAL.PRIMARY_ROLE}>
                      {ROLE_DISPLAY[u.role]?.label ?? u.role}
                    </span>
                  </span>
                  <span className="am-email">{u.email}</span>
                </span>
                {isMember ? (
                  <span className="am-role am-role--member">{ASSIGN_MEMBER_MODAL.ON_TEAM}</span>
                ) : (
                  <span className="am-role am-role--none">{ASSIGN_MEMBER_MODAL.NOT_ASSIGNED}</span>
                )}
              </div>
            );
          })}
        </div>

        {error && <p className="am-error">{error}</p>}
      </div>

      <div className="am-footer">
        <span className="am-count">
          {selected.length > 0
            ? ASSIGN_MEMBER_MODAL.SELECTED(selected.length)
            : ASSIGN_MEMBER_MODAL.SELECT_HINT}
        </span>
        <div className="am-actions">
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            {ASSIGN_MEMBER_MODAL.CANCEL}
          </Button>
          <Button
            variant="primary"
            onClick={handleAssign}
            loading={busy}
            disabled={selected.length === 0}
          >
            {busy ? ASSIGN_MEMBER_MODAL.ASSIGNING : ASSIGN_MEMBER_MODAL.ASSIGN(selected.length)}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
