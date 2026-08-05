import { EMPLOYEES_PAGE_LABELS } from "@/app/admin/employees/pages/employees-page.constants";
import type { Employee } from "@/app/admin/employees/pages/employees-page.types";
import { PersonAvatar } from "@/components/shared/person-avatar/person-avatar";
import type { Column } from "@/components/ui/data-table/data-table.types";

const fallback = (value: string | null | undefined): string =>
  value && value.length > 0 ? value : EMPLOYEES_PAGE_LABELS.UNASSIGNED;

export const buildEmployeesColumns = (): Column<Employee>[] => [
  {
    header: EMPLOYEES_PAGE_LABELS.COLUMN_EMPLOYEE,
    render: (e) => (
      <div className="employees-member-cell">
        <PersonAvatar
          className="employees-avatar"
          person={{
            name: e.name,
            email: e.email,
            phone: e.contact_number ?? undefined,
            designation: e.designation ?? undefined,
          }}
        />
        <div className="employees-member-info">
          <span className="employees-member-name">{e.name}</span>
          <span className="employees-member-email">{e.email}</span>
        </div>
      </div>
    ),
  },
  {
    header: EMPLOYEES_PAGE_LABELS.COLUMN_DESIGNATION,
    render: (e) => <span className="employees-cell-text">{fallback(e.designation)}</span>,
  },
  {
    header: EMPLOYEES_PAGE_LABELS.COLUMN_DEPARTMENT,
    render: (e) => <span className="employees-cell-text">{fallback(e.department)}</span>,
  },
  {
    header: EMPLOYEES_PAGE_LABELS.COLUMN_CONTACT,
    render: (e) => <span className="employees-cell-text">{fallback(e.contact_number)}</span>,
  },
  {
    header: EMPLOYEES_PAGE_LABELS.COLUMN_STATUS,
    render: (e) => (
      <span
        className={`employees-badge employees-badge--${e.user_id != null ? "linked" : "directory"}`}
      >
        {e.user_id != null
          ? EMPLOYEES_PAGE_LABELS.LINKED_USER_BADGE
          : EMPLOYEES_PAGE_LABELS.DIRECTORY_ONLY_BADGE}
      </span>
    ),
  },
];
