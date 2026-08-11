import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateEmployee } from "@/app/admin/employees/services/employees.service";
import type { Employee, UpdateEmployeePayload } from "@/app/admin/employees/pages/employees-page.types";
import { EDIT_EMPLOYEE_LABELS } from "@/app/admin/employees/components/edit-employee-modal/edit-employee-modal.constants";

type UseEditEmployeeArgs = {
  employee: Employee;
  onSuccess: (updated: Employee) => void;
};

export function useEditEmployee({ employee, onSuccess }: UseEditEmployeeArgs) {
  // UI-only state: editable HR fields + local submit error.
  const [designation, setDesignation] = useState(employee.designation ?? "");
  const [department, setDepartment] = useState(employee.department ?? "");
  const [contactNumber, setContactNumber] = useState(employee.contact_number ?? "");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: (payload: UpdateEmployeePayload) => updateEmployee(employee.emp_id, payload),
    onSuccess: ({ data }) => {
      onSuccess(data);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : EDIT_EMPLOYEE_LABELS.ERROR_FALLBACK;
      setError(msg);
    },
  });

  const submit = () => {
    setError("");
    const payload: UpdateEmployeePayload = {
      designation: designation.trim() || null,
      department: department.trim() || null,
      contact_number: contactNumber.trim() || null,
    };
    mutation.mutate(payload);
  };

  return {
    designation,
    setDesignation,
    department,
    setDepartment,
    contactNumber,
    setContactNumber,
    error,
    isSubmitting: mutation.isPending,
    submit,
  };
}
