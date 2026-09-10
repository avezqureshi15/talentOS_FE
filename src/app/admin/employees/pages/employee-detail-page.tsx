import { useState } from "react";
import { useParams } from "react-router-dom";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import { useEmployeeDetail } from "@/app/admin/employees/hooks/use-employee-detail";
import { buildSections } from "@/app/admin/employees/pages/employee-detail-fields";
import {
  EMPLOYEE_DETAIL_BACK_ICON,
  EMPLOYEE_DETAIL_LABELS,
} from "@/app/admin/employees/pages/employee-detail-page.constants";
import EditEmployeeModal from "@/app/admin/employees/components/edit-employee-modal/edit-employee-modal";
import { ROUTES } from "@/constants/routes";
import { PERMISSIONS } from "@/constants/permissions";
import { usePermissions } from "@/hooks/use-permissions";
import { PersonAvatar } from "@/components/shared/person-avatar/person-avatar";
import type { HeaderConfig } from "@/store/header.store";
import "./employee-detail-page.css";

const EmployeeDetailPage = () => {
  const { empId } = useParams<{ empId: string }>();
  const { can } = usePermissions();
  const canEdit = can(PERMISSIONS.USER_MANAGE);
  const { employee, isLoading, isError, refetch } = useEmployeeDetail(empId);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const actions: NonNullable<HeaderConfig["actions"]> | undefined =
    canEdit && employee
      ? [
          {
            key: "edit-employee",
            label: EMPLOYEE_DETAIL_LABELS.ACTION_EDIT,
            icon: "bx bx-edit-alt",
            variant: "primary",
            onClick: () => setIsEditOpen(true),
          },
        ]
      : undefined;

  return (
    <ErrorBoundary>
      <div className="employee-detail-page">
        <PageHeader
          title={EMPLOYEE_DETAIL_LABELS.PAGE_TITLE}
          titleIcon={EMPLOYEE_DETAIL_BACK_ICON}
          backRoute={ROUTES.ADMIN_EMPLOYEES}
          actions={actions}
        />

        {isLoading && (
          <div className="employee-detail-state">
            <LoadingSpinner />
          </div>
        )}

        {isError && (
          <div className="employee-detail-state employee-detail-state--error">
            {EMPLOYEE_DETAIL_LABELS.LOAD_ERROR}
          </div>
        )}

        {!isLoading && !isError && !employee && (
          <div className="employee-detail-state">{EMPLOYEE_DETAIL_LABELS.NOT_FOUND}</div>
        )}

        {employee && (
          <div className="employee-detail-body">
            <div className="employee-detail-hero">
              <PersonAvatar
                className="employee-detail-avatar"
                person={{
                  name: employee.name,
                  email: employee.email,
                  phone: employee.contact_number ?? undefined,
                  designation: [employee.designation, employee.department]
                    .filter(Boolean)
                    .join(" · ") || undefined,
                }}
              />
              <div className="employee-detail-hero-copy">
                <span className="employee-detail-hero-name">{employee.name}</span>
                <span className="employee-detail-hero-sub">
                  {employee.designation ?? EMPLOYEE_DETAIL_LABELS.UNASSIGNED}
                  {" · "}
                  {employee.department ?? EMPLOYEE_DETAIL_LABELS.UNASSIGNED}
                </span>
                <span
                  className={`employee-detail-link-badge employee-detail-link-badge--${
                    employee.user_id != null ? "linked" : "directory"
                  }`}
                >
                  {employee.user_id != null
                    ? EMPLOYEE_DETAIL_LABELS.LINKED_YES
                    : EMPLOYEE_DETAIL_LABELS.LINKED_NO}
                </span>
              </div>
            </div>

            <div className="employee-detail-sections">
              {buildSections(employee).map((section) => (
                <section key={section.title} className="employee-detail-section">
                  <h3 className="employee-detail-section-title">{section.title}</h3>
                  <dl className="employee-detail-fields">
                    {section.fields.map((f) => (
                      <div key={f.label} className="employee-detail-field">
                        <dt className="employee-detail-field-label">{f.label}</dt>
                        <dd className="employee-detail-field-value">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
          </div>
        )}

        {isEditOpen && employee && (
          <EditEmployeeModal
            employee={employee}
            onClose={() => setIsEditOpen(false)}
            onSuccess={() => {
              setIsEditOpen(false);
              void refetch();
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default EmployeeDetailPage;
