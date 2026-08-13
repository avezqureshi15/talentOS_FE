import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateEmployee } from "@/app/admin/employees/services/employees.service";
import type { Employee, UpdateEmployeePayload } from "@/app/admin/employees/pages/employees-page.types";
import { EDIT_EMPLOYEE_LABELS } from "@/app/admin/employees/components/edit-employee-modal/edit-employee-modal.constants";
import type { EditEmployeeFormState } from "@/app/admin/employees/components/edit-employee-modal/edit-employee-modal.types";

type UseEditEmployeeArgs = {
  employee: Employee;
  onSuccess: (updated: Employee) => void;
};

const formatDateInput = (value: string | null | undefined): string => value ?? "";

export function useEditEmployee({ employee, onSuccess }: UseEditEmployeeArgs) {
  // UI-only state: editable employee fields + local submit error.
  const [form, setForm] = useState<EditEmployeeFormState>({
    name: employee.name ?? "",
    email: employee.email ?? "",
    personalEmail: employee.personal_email ?? "",
    hrmsId: employee.hrms_id ?? "",
    designation: employee.designation ?? "",
    department: employee.department ?? "",
    band: employee.band ?? "",
    userType: employee.user_type ?? "",
    status: employee.status ?? "",
    contactNumber: employee.contact_number ?? "",
    workMode: employee.work_mode ?? "",
    deliveryStatus: employee.delivery_status ?? "",
    workLocationType: employee.work_location_type ?? "",
    doj: formatDateInput(employee.doj),
    doe: formatDateInput(employee.doe),
    dateOfBirth: formatDateInput(employee.date_of_birth),
    internshipDuration: employee.internship_duration != null ? String(employee.internship_duration) : "",
    skills: employee.skills ?? "",
  });
  const [error, setError] = useState("");

  const setField = <K extends keyof EditEmployeeFormState>(key: K, value: EditEmployeeFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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
    const toNullable = (value: string) => (value.trim() ? value.trim() : null);
    const payload: UpdateEmployeePayload = {
      name: toNullable(form.name),
      email: toNullable(form.email),
      personal_email: toNullable(form.personalEmail),
      hrms_id: toNullable(form.hrmsId),
      designation: toNullable(form.designation),
      department: toNullable(form.department),
      band: toNullable(form.band),
      user_type: toNullable(form.userType),
      status: toNullable(form.status),
      contact_number: toNullable(form.contactNumber),
      work_mode: toNullable(form.workMode),
      delivery_status: toNullable(form.deliveryStatus),
      work_location_type: toNullable(form.workLocationType),
      doj: form.doj || null,
      doe: form.doe || null,
      date_of_birth: form.dateOfBirth || null,
      internship_duration: form.internshipDuration.trim() !== "" ? Number(form.internshipDuration) : null,
      skills: toNullable(form.skills),
    };
    mutation.mutate(payload);
  };

  return {
    form,
    setField,
    error,
    isSubmitting: mutation.isPending,
    submit,
  };
}