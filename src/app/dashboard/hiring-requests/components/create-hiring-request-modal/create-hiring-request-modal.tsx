import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import Combobox from "@/components/ui/combobox/combobox";
import Select from "@/components/ui/select/select";
import Switch from "@/components/ui/switch/switch";
import { useCreateHiringRequest } from "@/app/dashboard/hiring-requests/hooks/use-create-hiring-request";
import { useDepartments } from "@/app/dashboard/hiring-requests/hooks/use-departments";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import { fetchUsers, type UserItem } from "@/services/users/users";
import { useAuth } from "@/app/auth/hooks/use-auth";
import { addJobTeamMember } from "@/app/dashboard/hiring-requests-detail/components/team-members/team-members.service";
import { FILTER_OPTIONS } from "@/constants/constants";
import { ROLE_DISPLAY } from "@/constants/role-display";
import {
  CREATE_HR_FIELDS,
  CREATE_HR_LOCATION_PRESETS,
  CREATE_HR_MODAL,
} from "./create-hiring-request-modal.constants";
import type {
  AssignMode,
  CreateHiringRequestModalProps,
  CreateHiringRequestStep,
  TeamAssignment,
} from "./create-hiring-request-modal.types";
import { useCreateHiringRequestForm } from "./use-create-hiring-request-form";
import "./create-hiring-request-modal.css";

const STEPS: CreateHiringRequestStep[] = [1, 2, 3];

export default function CreateHiringRequestModal({
  open,
  onClose,
  onCreated,
}: CreateHiringRequestModalProps) {
  const { values, errors, setField, reset, validate, toPayload } = useCreateHiringRequestForm();
  const { mutateAsync, isPending } = useCreateHiringRequest();
  const { data: departmentOptions = [] } = useDepartments();
  const { user } = useAuth();

  const [step, setStep] = useState<CreateHiringRequestStep>(1);
  const [assignMode, setAssignMode] = useState<AssignMode>(null);
  const [assignments, setAssignments] = useState<TeamAssignment[]>([]);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [usersStatus, setUsersStatus] = useState<"idle" | "loading" | "ready">("idle");
  const [selected, setSelected] = useState<UserItem | null>(null);
  const [stepError, setStepError] = useState("");

  const loadingUsers = usersStatus === "loading";

  const typeOptions = useMemo(
    () => FILTER_OPTIONS.TYPES.map((t) => ({ value: t, label: t })),
    [],
  );

  const resetAll = useCallback(() => {
    reset();
    setStep(1);
    setAssignMode(null);
    setAssignments([]);
    setSearch("");
    setUsers([]);
    setUsersStatus("idle");
    setSelected(null);
    setStepError("");
  }, [reset]);

  useEffect(() => {
    if (!open || assignMode !== "assign") return;
    let cancelled = false;
    fetchUsers(search.trim() || undefined, 1, 100)
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
  }, [open, assignMode, search]);

  const candidates = users.filter(
    (u) =>
      u.id !== user?.id && !assignments.some((a) => a.user.id === u.id),
  );

  const handleClose = () => {
    if (isPending) return;
    resetAll();
    onClose();
  };

  const handleNext = () => {
    if (step === 1 && !validate()) return;
    setStep((s) => Math.min(s + 1, 3) as CreateHiringRequestStep);
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1) as CreateHiringRequestStep);
  };

  const handleAssignMode = (mode: "assign" | "skip") => {
    setAssignMode(mode);
    setStepError("");
    if (mode === "skip") {
      setSearch("");
      setSelected(null);
      setUsers([]);
      setUsersStatus("idle");
    } else {
      setUsersStatus("loading");
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setUsersStatus("loading");
  };

  const handleAddAssignment = (user: UserItem) => {
    if (assignments.some((a) => a.user.id === user.id)) {
      setStepError(CREATE_HR_MODAL.ASSIGN_ALREADY_ADDED);
      return;
    }
    setAssignments((prev) => [...prev, { user }]);
    setSelected((prev) => (prev?.id === user.id ? null : prev));
    handleSearchChange("");
    setStepError("");
  };

  const handleRemoveAssignment = (userId: number) => {
    setAssignments((prev) => prev.filter((a) => a.user.id !== userId));
  };

  const handleSubmit = async () => {
    if (isPending) return;

    try {
      const created = await mutateAsync(toPayload());
      if (assignMode === "assign" && assignments.length > 0) {
        let failed = 0;
        for (const a of assignments) {
          try {
            await addJobTeamMember(created.id, {
              user_id: a.user.id,
              is_owner: false,
            });
          } catch {
            failed += 1;
          }
        }
        if (failed > 0) {
          useToastStore.getState().addToast(CREATE_HR_MODAL.ASSIGN_FAILED(failed), ToastType.ERROR);
        }
      }
      useToastStore.getState().addToast(CREATE_HR_MODAL.SUCCESS, ToastType.SUCCESS);
      resetAll();
      onClose();
      onCreated(created.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create hiring request";
      useToastStore.getState().addToast(message, ToastType.ERROR);
    }
  };

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title={CREATE_HR_MODAL.TITLE}
      icon={CREATE_HR_MODAL.ICON}
      className="create-hr-modal"
      overlayClassName="create-hr-overlay"
    >
      <div className="create-hr-body">
        <div className="create-hr-steps">
          {STEPS.map((s) => (
            <div
              key={s}
              className={`create-hr-step-dot${
                s === step
                  ? " create-hr-step-dot--active"
                  : s < step
                    ? " create-hr-step-dot--done"
                    : ""
              }`}
            />
          ))}
        </div>
        <div className="create-hr-step-title">
          {CREATE_HR_MODAL.STEP_TITLE(step, STEPS.length, CREATE_HR_MODAL.STEP_LABELS[step - 1])}
        </div>

        {step === 1 && (
          <div className="create-hr-grid">
            <Field
              label={CREATE_HR_FIELDS.title.label}
              required
              error={errors.title}
              className="create-hr-field--full"
            >
              <input
                className={`create-hr-input${errors.title ? " create-hr-input--error" : ""}`}
                value={values.title}
                maxLength={CREATE_HR_FIELDS.title.maxLength}
                placeholder={CREATE_HR_FIELDS.title.placeholder}
                disabled={isPending}
                onChange={(e) => setField("title", e.target.value)}
              />
            </Field>

            <Field label={CREATE_HR_FIELDS.department.label} required error={errors.department}>
              <Combobox
                className="create-hr-combobox"
                options={departmentOptions}
                placeholder={CREATE_HR_FIELDS.department.placeholder}
                value={values.department}
                disabled={isPending}
                error={!!errors.department}
                onChange={(v) => setField("department", v)}
              />
            </Field>

            <Field label={CREATE_HR_FIELDS.location.label} required error={errors.location}>
              <input
                className={`create-hr-input${errors.location ? " create-hr-input--error" : ""}`}
                list={CREATE_HR_FIELDS.location.listId}
                value={values.location}
                maxLength={CREATE_HR_FIELDS.location.maxLength}
                placeholder={CREATE_HR_FIELDS.location.placeholder}
                disabled={isPending}
                onChange={(e) => setField("location", e.target.value)}
              />
              <datalist id={CREATE_HR_FIELDS.location.listId}>
                {CREATE_HR_LOCATION_PRESETS.map((l) => (
                  <option key={l} value={l} />
                ))}
              </datalist>
            </Field>

            <Field label={CREATE_HR_FIELDS.type.label} required error={errors.type}>
              <Select
                className="create-hr-select"
                options={typeOptions}
                placeholder={CREATE_HR_FIELDS.type.placeholder}
                value={values.type}
                disabled={isPending}
                error={errors.type ? " " : undefined}
                onChange={(e) => setField("type", e.target.value)}
              />
            </Field>

            <div className="create-hr-field">
              <div className="create-hr-active">
                <div className="create-hr-active-copy">
                  <span className="create-hr-active-title">{CREATE_HR_MODAL.ACTIVE_LABEL}</span>
                  <span className="create-hr-active-hint">{CREATE_HR_MODAL.ACTIVE_HINT}</span>
                </div>
                <Switch
                  checked={values.is_active}
                  disabled={isPending}
                  onCheckedChange={(checked) => setField("is_active", checked)}
                />
              </div>
            </div>

            <Field
              label={CREATE_HR_FIELDS.description.label}
              required
              error={errors.description}
              className="create-hr-field--full"
            >
              <textarea
                className={`create-hr-textarea create-hr-textarea--lg${errors.description ? " create-hr-textarea--error" : ""}`}
                value={values.description}
                placeholder={CREATE_HR_FIELDS.description.placeholder}
                disabled={isPending}
                onChange={(e) => setField("description", e.target.value)}
              />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="create-hr-grid">
            <Field label={CREATE_HR_FIELDS.requirements.label} className="create-hr-field--pair">
              <textarea
                className="create-hr-textarea create-hr-textarea--pair"
                value={values.requirements}
                placeholder={CREATE_HR_FIELDS.requirements.placeholder}
                disabled={isPending}
                onChange={(e) => setField("requirements", e.target.value)}
              />
            </Field>

            <Field label={CREATE_HR_FIELDS.benefits.label} className="create-hr-field--pair">
              <textarea
                className="create-hr-textarea create-hr-textarea--pair"
                value={values.benefits}
                placeholder={CREATE_HR_FIELDS.benefits.placeholder}
                disabled={isPending}
                onChange={(e) => setField("benefits", e.target.value)}
              />
            </Field>

            <Field
              label={CREATE_HR_FIELDS.custom_evaluation_criteria.label}
              className="create-hr-field--full"
            >
              <textarea
                className="create-hr-textarea"
                value={values.custom_evaluation_criteria}
                placeholder={CREATE_HR_FIELDS.custom_evaluation_criteria.placeholder}
                disabled={isPending}
                onChange={(e) => setField("custom_evaluation_criteria", e.target.value)}
              />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="create-hr-assign">
            <div className="create-hr-assign-question">{CREATE_HR_MODAL.ASSIGN_QUESTION}</div>

            <div className="create-hr-assign-options">
              <button
                type="button"
                className={`create-hr-assign-option${
                  assignMode === "assign" ? " create-hr-assign-option--active" : ""
                }`}
                onClick={() => handleAssignMode("assign")}
              >
                <i className="bx bx-user-plus create-hr-assign-option-icon" />
                <span>
                  <span className="create-hr-assign-option-title">{CREATE_HR_MODAL.ASSIGN_NOW}</span>
                  <span className="create-hr-assign-option-desc">
                    Add team members who should see this job
                  </span>
                </span>
              </button>
              <button
                type="button"
                className={`create-hr-assign-option${
                  assignMode === "skip" ? " create-hr-assign-option--active" : ""
                }`}
                onClick={() => handleAssignMode("skip")}
              >
                <i className="bx bx-hourglass create-hr-assign-option-icon" />
                <span>
                  <span className="create-hr-assign-option-title">{CREATE_HR_MODAL.ASSIGN_SKIP}</span>
                  <span className="create-hr-assign-option-desc">Assign team members later</span>
                </span>
              </button>
            </div>

            {assignMode === "skip" && (
              <div className="create-hr-skip-hint">
                <i className="bx bx-info-circle" />
                {CREATE_HR_MODAL.ASSIGN_SKIP_HINT}
              </div>
            )}

            {assignMode === "assign" && (
              <>
                <div className="create-hr-assign-row">
                  <Field
                    label={CREATE_HR_MODAL.ASSIGN_SEARCH_LABEL}
                    className="create-hr-assign-search"
                  >
                    <input
                      type="text"
                      className="create-hr-input"
                      value={search}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder={CREATE_HR_MODAL.ASSIGN_SEARCH_PLACEHOLDER}
                    />
                  </Field>
                </div>

                {loadingUsers && <p className="create-hr-error">{CREATE_HR_MODAL.ASSIGN_LOADING}</p>}
                {!loadingUsers && candidates.length === 0 && (
                  <p className="create-hr-error">{CREATE_HR_MODAL.ASSIGN_EMPTY}</p>
                )}
                {candidates.map((u) => (
                  <div
                    key={u.id}
                    role="button"
                    tabIndex={0}
                    className={`create-hr-user-row${
                      selected?.id === u.id ? " create-hr-user-row--selected" : ""
                    }`}
                    onClick={() =>
                      setSelected((prev) => (prev?.id === u.id ? null : u))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelected((prev) => (prev?.id === u.id ? null : u));
                      }
                    }}
                  >
                    <span className="create-hr-user-avatar">{u.name.charAt(0).toUpperCase()}</span>
                    <span className="create-hr-user-info">
                      <span className="create-hr-user-name">{u.name}</span>
                      <span className="create-hr-user-email">{u.email}</span>
                    </span>
                    <span className="create-hr-user-check">
                      <i
                        className={`bx ${
                          selected?.id === u.id ? "bx-check-circle" : "bx-circle"
                        }`}
                      />
                    </span>
                    <button
                      type="button"
                      className="create-hr-user-add"
                      title={CREATE_HR_MODAL.ASSIGN_ADD}
                      aria-label={`${CREATE_HR_MODAL.ASSIGN_ADD} ${u.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddAssignment(u);
                      }}
                    >
                      <i className="bx bx-plus" />
                    </button>
                  </div>
                ))}

                {assignments.length > 0 && (
                  <div className="create-hr-assign-list">
                    <span className="create-hr-assign-option-desc">
                      {CREATE_HR_MODAL.ASSIGN_ADDED_HINT}
                    </span>
                    {assignments.map((a) => (
                      <div key={a.user.id} className="create-hr-assign-chip">
                        <span className="create-hr-assign-chip-avatar">
                          {a.user.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="create-hr-assign-chip-info">
                          <span className="create-hr-assign-chip-name">{a.user.name}</span>
                          <span className="create-hr-assign-chip-email">{a.user.email}</span>
                        </span>
                        <span className="create-hr-role-badge">
                          {ROLE_DISPLAY[a.user.role]?.label ?? a.user.role}
                        </span>
                        <button
                          type="button"
                          className="create-hr-assign-remove"
                          title="Remove"
                          onClick={() => handleRemoveAssignment(a.user.id)}
                        >
                          <i className="bx bx-x" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {stepError && <p className="create-hr-error">{stepError}</p>}
          </div>
        )}
      </div>

      <div className="create-hr-footer">
        <div className="create-hr-hint">
          <i className="bx bx-info-circle" />
          {CREATE_HR_MODAL.HINT}
        </div>
        <div className="create-hr-actions">
          {step === 1 ? (
            <button
              type="button"
              className="create-hr-btn create-hr-btn--ghost"
              onClick={handleClose}
              disabled={isPending}
            >
              {CREATE_HR_MODAL.CANCEL}
            </button>
          ) : (
            <button
              type="button"
              className="create-hr-btn create-hr-btn--ghost"
              onClick={handleBack}
              disabled={isPending}
            >
              {CREATE_HR_MODAL.BACK}
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              className="create-hr-btn create-hr-btn--primary"
              onClick={handleNext}
              disabled={isPending}
            >
              {CREATE_HR_MODAL.NEXT}
            </button>
          ) : (
            <button
              type="button"
              className="create-hr-btn create-hr-btn--primary"
              onClick={handleSubmit}
              disabled={isPending || assignMode === null}
            >
              {isPending
                ? CREATE_HR_MODAL.SUBMITTING
                : assignMode === "assign" && assignments.length > 0
                  ? CREATE_HR_MODAL.ASSIGN_CREATE_WITH_TEAM
                  : CREATE_HR_MODAL.ASSIGN_CREATE}
            </button>
          )}
        </div>
      </div>
    </BaseModal>
  );
}

function Field({
  label,
  required,
  error,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`create-hr-field ${className}`.trim()}>
      <label className="create-hr-label">
        {label}
        {required ? <span className="create-hr-required">*</span> : null}
      </label>
      {children}
      {error ? <span className="create-hr-error">{error}</span> : null}
    </div>
  );
}
