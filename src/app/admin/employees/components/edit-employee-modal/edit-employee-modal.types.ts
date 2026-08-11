import type { Employee } from "@/app/admin/employees/pages/employees-page.types";

export type EditEmployeeModalProps = {
  employee: Employee;
  onClose: () => void;
  onSuccess: (updated: Employee) => void;
};

export type EditEmployeeFormState = {
  designation: string;
  department: string;
  contactNumber: string;
};
