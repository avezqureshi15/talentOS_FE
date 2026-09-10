import type { Employee } from "@/app/admin/employees/pages/employees-page.types";

export type EditEmployeeModalProps = {
  employee: Employee;
  onClose: () => void;
  onSuccess: (updated: Employee) => void;
};

export type EditEmployeeStage = "identity" | "role" | "employment";

export type EditEmployeeFormState = {
  name: string;
  email: string;
  personalEmail: string;
  hrmsId: string;
  designation: string;
  department: string;
  band: string;
  userType: string;
  status: string;
  contactNumber: string;
  workMode: string;
  deliveryStatus: string;
  workLocationType: string;
  doj: string;
  doe: string;
  dateOfBirth: string;
  internshipDuration: string;
  skills: string;
};