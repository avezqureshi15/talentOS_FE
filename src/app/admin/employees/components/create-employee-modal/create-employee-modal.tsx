import { type FormEvent } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import { useCreateEmployee } from "./use-create-employee";
import { CREATE_EMPLOYEE_LABELS } from "./create-employee-modal.constants";
import "./create-employee-modal.css";

type CreateEmployeeModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

type FieldSpec = {
  id: string;
  formKey: "empId" | "name" | "email" | "designation" | "department";
  label: string;
  placeholder: string;
  required?: boolean;
  type?: "text" | "email";
  autoFocus?: boolean;
};

const FIELDS: FieldSpec[] = [
  {
    id: "cem-emp-id",
    formKey: "empId",
    label: CREATE_EMPLOYEE_LABELS.EMP_ID,
    placeholder: CREATE_EMPLOYEE_LABELS.EMP_ID_PLACEHOLDER,
    required: true,
    autoFocus: true,
  },
  {
    id: "cem-name",
    formKey: "name",
    label: CREATE_EMPLOYEE_LABELS.NAME,
    placeholder: CREATE_EMPLOYEE_LABELS.NAME_PLACEHOLDER,
    required: true,
  },
  {
    id: "cem-email",
    formKey: "email",
    label: CREATE_EMPLOYEE_LABELS.EMAIL,
    placeholder: CREATE_EMPLOYEE_LABELS.EMAIL_PLACEHOLDER,
    required: true,
    type: "email",
  },
  {
    id: "cem-designation",
    formKey: "designation",
    label: CREATE_EMPLOYEE_LABELS.DESIGNATION,
    placeholder: CREATE_EMPLOYEE_LABELS.DESIGNATION_PLACEHOLDER,
  },
  {
    id: "cem-department",
    formKey: "department",
    label: CREATE_EMPLOYEE_LABELS.DEPARTMENT,
    placeholder: CREATE_EMPLOYEE_LABELS.DEPARTMENT_PLACEHOLDER,
  },
];

export default function CreateEmployeeModal({ open, onClose, onSuccess }: CreateEmployeeModalProps) {
  const { form, setField, error, isSubmitting, submit } = useCreateEmployee({ open, onSuccess });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={CREATE_EMPLOYEE_LABELS.TITLE}
      icon={CREATE_EMPLOYEE_LABELS.ICON}
      className="create-employee-modal"
    >
      <form className="cem-form" onSubmit={handleSubmit}>
        {FIELDS.map((field) => (
          <div className="cem-field" key={field.id}>
            <label className="cem-label" htmlFor={field.id}>
              {field.label}
              {field.required ? (
                <span className="cem-required" aria-hidden="true">
                  *
                </span>
              ) : (
                <span className="cem-optional">({CREATE_EMPLOYEE_LABELS.OPTIONAL})</span>
              )}
            </label>
            <input
              id={field.id}
              type={field.type ?? "text"}
              className="cem-input"
              value={form[field.formKey]}
              onChange={(e) => setField(field.formKey, e.target.value)}
              placeholder={field.placeholder}
              autoFocus={field.autoFocus}
              autoComplete="off"
            />
          </div>
        ))}

        {error ? <p className="cem-error">{error}</p> : null}

        <div className="cem-actions">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            {CREATE_EMPLOYEE_LABELS.CANCEL}
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            loadingText={CREATE_EMPLOYEE_LABELS.SUBMITTING}
          >
            {CREATE_EMPLOYEE_LABELS.SUBMIT}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
