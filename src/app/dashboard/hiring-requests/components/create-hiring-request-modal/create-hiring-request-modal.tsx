import { useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import Combobox from "@/components/ui/combobox/combobox";
import Select from "@/components/ui/select/select";
import Switch from "@/components/ui/switch/switch";
import { useCreateHiringRequest } from "@/app/dashboard/hiring-requests/hooks/use-create-hiring-request";
import { useDepartments } from "@/app/dashboard/hiring-requests/hooks/use-departments";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import { FILTER_OPTIONS } from "@/constants/constants";
import {
  CREATE_HR_FIELDS,
  CREATE_HR_LOCATION_PRESETS,
  CREATE_HR_MODAL,
} from "./create-hiring-request-modal.constants";
import type { CreateHiringRequestModalProps } from "./create-hiring-request-modal.types";
import { useCreateHiringRequestForm } from "./use-create-hiring-request-form";
import "./create-hiring-request-modal.css";

export default function CreateHiringRequestModal({
  open,
  onClose,
  onCreated,
}: CreateHiringRequestModalProps) {
  const { values, errors, setField, reset, validate, toPayload } = useCreateHiringRequestForm();
  const { mutateAsync, isPending } = useCreateHiringRequest();
  const { data: departmentOptions = [] } = useDepartments();

  const typeOptions = useMemo(
    () => FILTER_OPTIONS.TYPES.map((t) => ({ value: t, label: t })),
    [],
  );

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (isPending) return;
    if (!validate()) return;

    try {
      const created = await mutateAsync(toPayload());
      useToastStore.getState().addToast(CREATE_HR_MODAL.SUCCESS, ToastType.SUCCESS);
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
    >
      <div className="create-hr-body">
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
      </div>

      <div className="create-hr-footer">
        <div className="create-hr-hint">
          <i className="bx bx-info-circle" />
          {CREATE_HR_MODAL.HINT}
        </div>
        <div className="create-hr-actions">
          <button
            type="button"
            className="create-hr-btn create-hr-btn--ghost"
            onClick={handleClose}
            disabled={isPending}
          >
            {CREATE_HR_MODAL.CANCEL}
          </button>
          <button
            type="button"
            className="create-hr-btn create-hr-btn--primary"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? CREATE_HR_MODAL.SUBMITTING : CREATE_HR_MODAL.SUBMIT}
          </button>
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
