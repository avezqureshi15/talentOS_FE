import { useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import { useEditEmployee } from "@/app/admin/employees/hooks/use-edit-employee";
import {
  EDIT_EMPLOYEE_LABELS,
  EDIT_EMPLOYEE_PLACEHOLDERS,
  EDIT_EMPLOYEE_STAGE_ORDER,
} from "./edit-employee-modal.constants";
import type {
  EditEmployeeFormState,
  EditEmployeeModalProps,
  EditEmployeeStage,
} from "./edit-employee-modal.types";
import "./edit-employee-modal.css";

const STAGE_LABELS: Record<EditEmployeeStage, string> = {
  identity: EDIT_EMPLOYEE_LABELS.STAGES.IDENTITY,
  role: EDIT_EMPLOYEE_LABELS.STAGES.ROLE,
  employment: EDIT_EMPLOYEE_LABELS.STAGES.EMPLOYMENT,
};

const inputClassName = "edit-employee-input";

type FieldProps = {
  label: string;
  fullWidth?: boolean;
  children: ReactNode;
};

function Field({ label, fullWidth, children }: FieldProps) {
  return (
    <div className={`edit-employee-field${fullWidth ? " edit-employee-field--full" : ""}`}>
      <label className="edit-employee-label">{label}</label>
      {children}
    </div>
  );
}

type TextInputProps = {
  formKey: keyof EditEmployeeFormState;
  value: string;
  setField: <K extends keyof EditEmployeeFormState>(key: K, value: EditEmployeeFormState[K]) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "className">;

function TextInput({ formKey, value, setField, ...rest }: TextInputProps) {
  return (
    <input
      className={inputClassName}
      value={value}
      onChange={(e) => setField(formKey, e.target.value)}
      {...rest}
    />
  );
}

export default function EditEmployeeModal({ employee, onClose, onSuccess }: EditEmployeeModalProps) {
  const { form, setField, error, isSubmitting, submit } = useEditEmployee({ employee, onSuccess });
  const [stage, setStage] = useState<EditEmployeeStage>("identity");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  return (
    <BaseModal
      open
      onClose={onClose}
      showClose={false}
      className="edit-employee-modal"
      overlayClassName="edit-employee-overlay"
    >
      <div className="edit-employee-shell">
        <header className="edit-employee-header">
          <div className="edit-employee-header-text">
            <h2 className="edit-employee-title">{EDIT_EMPLOYEE_LABELS.TITLE}</h2>
            <p className="edit-employee-subtitle">{EDIT_EMPLOYEE_LABELS.SUBTITLE(employee.name)}</p>
          </div>
          <button
            type="button"
            className="edit-employee-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <i className="bx bx-x" aria-hidden />
          </button>
        </header>

        <div className="edit-employee-body">
          <nav className="edit-employee-sidebar" aria-label="Employee edit sections">
            {EDIT_EMPLOYEE_STAGE_ORDER.map((key) => (
              <button
                key={key}
                type="button"
                className={`edit-employee-nav-btn${stage === key ? " edit-employee-nav-btn--active" : ""}`}
                onClick={() => setStage(key)}
                aria-current={stage === key ? "page" : undefined}
              >
                {STAGE_LABELS[key]}
              </button>
            ))}
          </nav>

          <div className="edit-employee-main">
            <form className="edit-employee-form" onSubmit={handleSubmit}>
              <div className="edit-employee-panel">
                {stage === "identity" && (
                  <div className="edit-employee-grid">
                    <Field label={EDIT_EMPLOYEE_LABELS.EMP_ID}>
                      <input
                        type="text"
                        className={inputClassName}
                        value={employee.emp_id}
                        placeholder={EDIT_EMPLOYEE_PLACEHOLDERS.EMP_ID}
                        disabled
                      />
                    </Field>
                    <Field label={EDIT_EMPLOYEE_LABELS.NAME}>
                      <TextInput
                        formKey="name"
                        value={form.name}
                        setField={setField}
                        type="text"
                        placeholder={EDIT_EMPLOYEE_PLACEHOLDERS.NAME}
                      />
                    </Field>
                    <Field label={EDIT_EMPLOYEE_LABELS.EMAIL}>
                      <TextInput
                        formKey="email"
                        value={form.email}
                        setField={setField}
                        type="email"
                        placeholder={EDIT_EMPLOYEE_PLACEHOLDERS.EMAIL}
                      />
                    </Field>
                    <Field label={EDIT_EMPLOYEE_LABELS.PERSONAL_EMAIL}>
                      <TextInput
                        formKey="personalEmail"
                        value={form.personalEmail}
                        setField={setField}
                        type="email"
                        placeholder={EDIT_EMPLOYEE_PLACEHOLDERS.PERSONAL_EMAIL}
                      />
                    </Field>
                    <Field label={EDIT_EMPLOYEE_LABELS.HRMS_ID}>
                      <TextInput
                        formKey="hrmsId"
                        value={form.hrmsId}
                        setField={setField}
                        type="text"
                        placeholder={EDIT_EMPLOYEE_PLACEHOLDERS.HRMS_ID}
                      />
                    </Field>
                    <Field label={EDIT_EMPLOYEE_LABELS.CONTACT}>
                      <TextInput
                        formKey="contactNumber"
                        value={form.contactNumber}
                        setField={setField}
                        type="text"
                        placeholder={EDIT_EMPLOYEE_PLACEHOLDERS.CONTACT}
                      />
                    </Field>
                  </div>
                )}

                {stage === "role" && (
                  <div className="edit-employee-grid">
                    <Field label={EDIT_EMPLOYEE_LABELS.DESIGNATION}>
                      <TextInput
                        formKey="designation"
                        value={form.designation}
                        setField={setField}
                        type="text"
                        placeholder={EDIT_EMPLOYEE_PLACEHOLDERS.DESIGNATION}
                      />
                    </Field>
                    <Field label={EDIT_EMPLOYEE_LABELS.DEPARTMENT}>
                      <TextInput
                        formKey="department"
                        value={form.department}
                        setField={setField}
                        type="text"
                        placeholder={EDIT_EMPLOYEE_PLACEHOLDERS.DEPARTMENT}
                      />
                    </Field>
                    <Field label={EDIT_EMPLOYEE_LABELS.BAND}>
                      <TextInput
                        formKey="band"
                        value={form.band}
                        setField={setField}
                        type="text"
                        placeholder={EDIT_EMPLOYEE_PLACEHOLDERS.BAND}
                      />
                    </Field>
                    <Field label={EDIT_EMPLOYEE_LABELS.USER_TYPE}>
                      <TextInput
                        formKey="userType"
                        value={form.userType}
                        setField={setField}
                        type="text"
                        placeholder={EDIT_EMPLOYEE_PLACEHOLDERS.USER_TYPE}
                      />
                    </Field>
                    <Field label={EDIT_EMPLOYEE_LABELS.STATUS} fullWidth>
                      <TextInput
                        formKey="status"
                        value={form.status}
                        setField={setField}
                        type="text"
                        placeholder={EDIT_EMPLOYEE_PLACEHOLDERS.STATUS}
                      />
                    </Field>
                  </div>
                )}

                {stage === "employment" && (
                  <div className="edit-employee-grid">
                    <Field label={EDIT_EMPLOYEE_LABELS.WORK_MODE}>
                      <TextInput
                        formKey="workMode"
                        value={form.workMode}
                        setField={setField}
                        type="text"
                        placeholder={EDIT_EMPLOYEE_PLACEHOLDERS.WORK_MODE}
                      />
                    </Field>
                    <Field label={EDIT_EMPLOYEE_LABELS.DELIVERY_STATUS}>
                      <TextInput
                        formKey="deliveryStatus"
                        value={form.deliveryStatus}
                        setField={setField}
                        type="text"
                        placeholder={EDIT_EMPLOYEE_PLACEHOLDERS.DELIVERY_STATUS}
                      />
                    </Field>
                    <Field label={EDIT_EMPLOYEE_LABELS.WORK_LOCATION} fullWidth>
                      <TextInput
                        formKey="workLocationType"
                        value={form.workLocationType}
                        setField={setField}
                        type="text"
                        placeholder={EDIT_EMPLOYEE_PLACEHOLDERS.WORK_LOCATION}
                      />
                    </Field>
                    <Field label={EDIT_EMPLOYEE_LABELS.DOJ}>
                      <TextInput
                        formKey="doj"
                        value={form.doj}
                        setField={setField}
                        type="date"
                        placeholder={EDIT_EMPLOYEE_PLACEHOLDERS.DOJ}
                      />
                    </Field>
                    <Field label={EDIT_EMPLOYEE_LABELS.DOE}>
                      <TextInput
                        formKey="doe"
                        value={form.doe}
                        setField={setField}
                        type="date"
                        placeholder={EDIT_EMPLOYEE_PLACEHOLDERS.DOE}
                      />
                    </Field>
                    <Field label={EDIT_EMPLOYEE_LABELS.DATE_OF_BIRTH}>
                      <TextInput
                        formKey="dateOfBirth"
                        value={form.dateOfBirth}
                        setField={setField}
                        type="date"
                        placeholder={EDIT_EMPLOYEE_PLACEHOLDERS.DATE_OF_BIRTH}
                      />
                    </Field>
                    <Field label={EDIT_EMPLOYEE_LABELS.INTERNSHIP_DURATION}>
                      <TextInput
                        formKey="internshipDuration"
                        value={form.internshipDuration}
                        setField={setField}
                        type="number"
                        min={0}
                        placeholder={EDIT_EMPLOYEE_PLACEHOLDERS.INTERNSHIP_DURATION}
                      />
                    </Field>
                    <Field label={EDIT_EMPLOYEE_LABELS.SKILLS} fullWidth>
                      <TextInput
                        formKey="skills"
                        value={form.skills}
                        setField={setField}
                        type="text"
                        placeholder={EDIT_EMPLOYEE_PLACEHOLDERS.SKILLS}
                      />
                    </Field>
                  </div>
                )}
              </div>

              {error ? <p className="edit-employee-error">{error}</p> : null}

              <footer className="edit-employee-footer">
                <button
                  type="button"
                  className="edit-employee-btn edit-employee-btn--ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  {EDIT_EMPLOYEE_LABELS.CANCEL}
                </button>
                <button
                  type="submit"
                  className="edit-employee-btn edit-employee-btn--primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? EDIT_EMPLOYEE_LABELS.SAVING : EDIT_EMPLOYEE_LABELS.SAVE}
                </button>
              </footer>
            </form>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
