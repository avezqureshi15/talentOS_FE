import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/constants";
import { createEmployee } from "@/app/admin/employees/services/employees.service";
import type { CreateEmployeePayload } from "@/app/admin/employees/pages/employees-page.types";
import { getApiErrorMessage } from "@/utils/api-error";
import { isValidEmail } from "@/utils/validation";
import { useToast } from "@/hooks/use-toast";
import { CREATE_EMPLOYEE_LABELS } from "./create-employee-modal.constants";

export type CreateEmployeeFormState = {
  empId: string;
  name: string;
  email: string;
  designation: string;
  department: string;
};

const EMPTY_FORM: CreateEmployeeFormState = {
  empId: "",
  name: "",
  email: "",
  designation: "",
  department: "",
};

type UseCreateEmployeeArgs = {
  open: boolean;
  onSuccess: () => void;
};

export function useCreateEmployee({ open, onSuccess }: UseCreateEmployeeArgs) {
  const queryClient = useQueryClient();
  const { success: showSuccess } = useToast();
  const [form, setForm] = useState<CreateEmployeeFormState>(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setForm(EMPTY_FORM);
      setError("");
    }
  }, [open]);

  const setField = <K extends keyof CreateEmployeeFormState>(key: K, value: CreateEmployeeFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  };

  const mutation = useMutation({
    mutationFn: (payload: CreateEmployeePayload) => createEmployee(payload),
    onSuccess: () => {
      setError("");
      showSuccess(CREATE_EMPLOYEE_LABELS.TOAST_SUCCESS);
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYEES] });
      onSuccess();
    },
    onError: (err: unknown) => {
      setError(getApiErrorMessage(err, CREATE_EMPLOYEE_LABELS.ERR_GENERIC));
    },
  });

  const submit = () => {
    setError("");
    const empId = form.empId.trim();
    const name = form.name.trim();
    const email = form.email.trim();
    if (!empId) {
      setError(CREATE_EMPLOYEE_LABELS.ERR_EMP_ID);
      return;
    }
    if (!name) {
      setError(CREATE_EMPLOYEE_LABELS.ERR_NAME);
      return;
    }
    if (!email) {
      setError(CREATE_EMPLOYEE_LABELS.ERR_EMAIL);
      return;
    }
    if (!isValidEmail(email)) {
      setError(CREATE_EMPLOYEE_LABELS.ERR_EMAIL_INVALID);
      return;
    }

    const payload: CreateEmployeePayload = { emp_id: empId, email, name };
    const designation = form.designation.trim();
    const department = form.department.trim();
    if (designation) payload.designation = designation;
    if (department) payload.department = department;

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
