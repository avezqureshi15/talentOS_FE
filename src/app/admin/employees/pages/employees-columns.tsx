import { EMPLOYEES_PAGE_LABELS } from "@/app/admin/employees/pages/employees-page.constants";
import type { Employee } from "@/app/admin/employees/pages/employees-page.types";
import { PersonAvatar } from "@/components/shared/person-avatar/person-avatar";
import { TruncatedCell } from "@/components/shared/truncated-cell/truncated-cell";
import type { Column } from "@/components/ui/data-table/data-table.types";

const fallback = (value: string | null | undefined): string =>
  value && value.length > 0 ? value : EMPLOYEES_PAGE_LABELS.UNASSIGNED;

type BuildEmployeesColumnsOptions = {
  onEdit?: (employee: Employee) => void;
};

export const buildEmployeesColumns = ({
  onEdit,
}: BuildEmployeesColumnsOptions = {}): Column<Employee>[] => [
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
          <TruncatedCell text={e.name} className="employees-member-name" />
          <TruncatedCell text={e.email} className="employees-member-email" />
        </div>
      </div>
    ),
  },
  {
    header: EMPLOYEES_PAGE_LABELS.COLUMN_DESIGNATION,
    render: (e) => <TruncatedCell text={fallback(e.designation)} className="employees-cell-text" />,
  },
  {
    header: EMPLOYEES_PAGE_LABELS.COLUMN_DEPARTMENT,
    render: (e) => <TruncatedCell text={fallback(e.department)} className="employees-cell-text" />,
  },
  {
    header: EMPLOYEES_PAGE_LABELS.COLUMN_CONTACT,
    render: (e) => <TruncatedCell text={fallback(e.contact_number)} className="employees-cell-text" />,
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
  ...(onEdit
    ? [
        {
          header: EMPLOYEES_PAGE_LABELS.COLUMN_ACTIONS,
          render: (e: Employee) => (
            <button
              type="button"
              className="employees-edit-btn"
              onClick={(ev) => {
                ev.stopPropagation();
                onEdit(e);
              }}
            >
              {EMPLOYEES_PAGE_LABELS.ACTION_EDIT}
            </button>
          ),
        } satisfies Column<Employee>,
      ]
    : []),
];
