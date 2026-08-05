import { EMPLOYEE_DETAIL_LABELS } from "@/app/admin/employees/pages/employee-detail-page.constants";
import type { Employee } from "@/app/admin/employees/pages/employees-page.types";

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
};

const fallback = (value: string | number | null | undefined): string =>
  value !== null && value !== undefined && value !== ""
    ? String(value)
    : EMPLOYEE_DETAIL_LABELS.UNASSIGNED;

type Field = { label: string; value: string };

export type Section = {
  title: string;
  fields: Field[];
};

export const buildSections = (e: Employee): Section[] => [
  {
    title: EMPLOYEE_DETAIL_LABELS.SECTION_IDENTITY,
    fields: [
      { label: EMPLOYEE_DETAIL_LABELS.FIELD_NAME, value: fallback(e.name) },
      { label: EMPLOYEE_DETAIL_LABELS.FIELD_EMP_ID, value: fallback(e.emp_id) },
      { label: EMPLOYEE_DETAIL_LABELS.FIELD_EMAIL, value: fallback(e.email) },
      { label: EMPLOYEE_DETAIL_LABELS.FIELD_PERSONAL_EMAIL, value: fallback(e.personal_email) },
      { label: EMPLOYEE_DETAIL_LABELS.FIELD_HRMS_ID, value: fallback(e.hrms_id) },
    ],
  },
  {
    title: EMPLOYEE_DETAIL_LABELS.SECTION_ROLE,
    fields: [
      { label: EMPLOYEE_DETAIL_LABELS.FIELD_DESIGNATION, value: fallback(e.designation) },
      { label: EMPLOYEE_DETAIL_LABELS.FIELD_DEPARTMENT, value: fallback(e.department) },
      { label: EMPLOYEE_DETAIL_LABELS.FIELD_BAND, value: fallback(e.band) },
      { label: EMPLOYEE_DETAIL_LABELS.FIELD_USER_TYPE, value: fallback(e.user_type) },
    ],
  },
  {
    title: EMPLOYEE_DETAIL_LABELS.SECTION_CONTACT,
    fields: [{ label: EMPLOYEE_DETAIL_LABELS.FIELD_CONTACT, value: fallback(e.contact_number) }],
  },
  {
    title: EMPLOYEE_DETAIL_LABELS.SECTION_EMPLOYMENT,
    fields: [
      { label: EMPLOYEE_DETAIL_LABELS.FIELD_STATUS, value: fallback(e.status) },
      { label: EMPLOYEE_DETAIL_LABELS.FIELD_WORK_MODE, value: fallback(e.work_mode) },
      { label: EMPLOYEE_DETAIL_LABELS.FIELD_DELIVERY_STATUS, value: fallback(e.delivery_status) },
      { label: EMPLOYEE_DETAIL_LABELS.FIELD_WORK_LOCATION, value: fallback(e.work_location_type) },
      { label: EMPLOYEE_DETAIL_LABELS.FIELD_CREATED_AT, value: formatDate(e.created_at) },
    ],
  },
];
