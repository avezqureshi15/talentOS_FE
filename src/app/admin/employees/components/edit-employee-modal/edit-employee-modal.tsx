import { useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import { updateEmployee } from "@/app/admin/employees/services/employees.service";
import type { Employee } from "@/app/admin/employees/pages/employees-page.types";
import "@/app/admin/users/components/admin-modal.css";

type Props = {
  employee: Employee;
  onClose: () => void;
  onSuccess: (updated: Employee) => void;
};

export default function EditEmployeeModal({ employee, onClose, onSuccess }: Props) {
  const [designation, setDesignation] = useState(employee.designation ?? "");
  const [department, setDepartment] = useState(employee.department ?? "");
  const [contactNumber, setContactNumber] = useState(employee.contact_number ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        designation: designation.trim() || null,
        department: department.trim() || null,
        contact_number: contactNumber.trim() || null,
      };
      const { data } = await updateEmployee(employee.emp_id, payload);
      onSuccess(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update employee";
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <BaseModal open title={`Edit Employee: ${employee.name}`} onClose={onClose}>
      <form className="admin-modal-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label className="admin-label">Designation</label>
          <input
            type="text"
            className="admin-input"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            autoFocus
          />
        </div>
        <div className="admin-field">
          <label className="admin-label">Department</label>
          <input
            type="text"
            className="admin-input"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
        <div className="admin-field">
          <label className="admin-label">Contact</label>
          <input
            type="text"
            className="admin-input"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="Phone number"
          />
        </div>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-modal-actions">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
