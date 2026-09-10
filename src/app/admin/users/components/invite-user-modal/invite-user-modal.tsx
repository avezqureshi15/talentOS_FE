import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import Select from "@/components/ui/select/select";
import { ROLE_OPTIONS } from "@/constants/role-options";
import InviteEmployeePicker from "./invite-employee-picker";
import { useInviteUser } from "./use-invite-user";
import { INVITE_MODAL_LABELS, INVITE_TABS } from "./invite-user-modal.constants";
import type { InviteUserModalProps } from "./invite-user-modal.types";
import "./invite-user-modal.css";

export default function InviteUserModal({
  onClose,
  onSuccess,
  tenantId,
  mode = "email-only",
}: InviteUserModalProps) {
  const {
    tab,
    setTab,
    email,
    setEmail,
    role,
    setRole,
    selected,
    setSelected,
    search,
    setSearch,
    error,
    canSubmit,
    isSubmitting,
    submit,
    employees,
    isSearching,
  } = useInviteUser({ mode, tenantId, onSuccess });

  const showTabs = mode === "existing-and-email";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submit();
  };

  return (
    <BaseModal open title={INVITE_MODAL_LABELS.TITLE} onClose={onClose}>
      <form className="ium-form" onSubmit={handleSubmit}>
        {showTabs && (
          <div className="ium-tabs" role="tablist" aria-label={INVITE_MODAL_LABELS.TITLE}>
            {INVITE_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                className={`ium-tab${tab === t.key ? " ium-tab--active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {showTabs && tab === "existing" ? (
          <InviteEmployeePicker
            search={search}
            onSearchChange={setSearch}
            employees={employees}
            isSearching={isSearching}
            selected={selected}
            onSelect={setSelected}
            onClear={() => setSelected(null)}
          />
        ) : (
          <div className="ium-field">
            <label className="ium-label" htmlFor="ium-email">
              {INVITE_MODAL_LABELS.EMAIL_LABEL}
              <span className="ium-required" aria-hidden="true">*</span>
            </label>
            <input
              id="ium-email"
              type="email"
              className="ium-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={INVITE_MODAL_LABELS.EMAIL_PLACEHOLDER}
              autoFocus
            />
          </div>
        )}

        <div className="ium-field">
          <label className="ium-label" htmlFor="ium-role">
            {INVITE_MODAL_LABELS.ROLE_LABEL}
          </label>
          <Select
            id="ium-role"
            options={ROLE_OPTIONS}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        {error && <p className="ium-error">{error}</p>}

        <div className="ium-actions">
          <Button variant="ghost" onClick={onClose}>
            {INVITE_MODAL_LABELS.CANCEL}
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={isSubmitting}
            disabled={!canSubmit}
          >
            {isSubmitting ? INVITE_MODAL_LABELS.SUBMITTING : INVITE_MODAL_LABELS.SUBMIT}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
