import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import { useEditEmployee } from "@/app/admin/employees/hooks/use-edit-employee";
import { EDIT_EMPLOYEE_LABELS } from "./edit-employee-modal.constants";
import type { EditEmployeeModalProps } from "./edit-employee-modal.types";
import "./edit-employee-modal.css";

export default function EditEmployeeModal({ employee, onClose, onSuccess }: EditEmployeeModalProps) {
  const {
    designation,
    setDesignation,
    department,
    setDepartment,
    contactNumber,
    setContactNumber,
    error,
    isSubmitting,
    submit,
  } = useEditEmployee({ employee, onSuccess });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submit();
  };

  return (
    <BaseModal open title={EDIT_EMPLOYEE_LABELS.TITLE(employee.name)} onClose={onClose}>
      <form className="admin-modal-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label className="admin-label">{EDIT_EMPLOYEE_LABELS.DESIGNATION}</label>
          <input
            type="text"
            className="admin-input"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            autoFocus
          />
        </div>
        <div className="admin-field">
          <label className="admin-label">{EDIT_EMPLOYEE_LABELS.DEPARTMENT}</label>
          <input
            type="text"
            className="admin-input"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
        <div className="admin-field">
          <label className="admin-label">{EDIT_EMPLOYEE_LABELS.CONTACT}</label>
          <input
            type="text"
            className="admin-input"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder={EDIT_EMPLOYEE_LABELS.CONTACT_PLACEHOLDER}
          />
        </div>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-modal-actions">
          <Button variant="ghost" onClick={onClose} type="button">
            {EDIT_EMPLOYEE_LABELS.CANCEL}
          </Button>
          <Button variant="primary" type="submit" loading={isSubmitting}>
            {isSubmitting ? EDIT_EMPLOYEE_LABELS.SAVING : EDIT_EMPLOYEE_LABELS.SAVE}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
