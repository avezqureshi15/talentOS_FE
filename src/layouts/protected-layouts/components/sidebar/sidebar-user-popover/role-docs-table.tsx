import { PERSONA_LABELS } from "@/constants/personas";
import { ROLE_DOCS_FEATURES, ROLE_DOCS_PERSONAS } from "@/constants/role-docs";
import { TruncatedCell } from "@/components/shared/truncated-cell/truncated-cell";
import "./role-docs-table.css";

const RoleDocsTable = () => (
  <div className="role-docs">
    <div className="role-docs-table-wrap">
      <table className="role-docs-table">
        <thead>
          <tr>
            <th className="role-docs-table__feature">Permission</th>
            {ROLE_DOCS_PERSONAS.map((persona) => (
              <th key={persona} className="role-docs-table__persona">
                {PERSONA_LABELS[persona] ?? persona}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROLE_DOCS_FEATURES.map((feature) => (
            <tr key={feature.id}>
              <td className="role-docs-table__feature">
                <TruncatedCell text={feature.label} className="role-docs-feature-label" />
                <TruncatedCell text={feature.description} className="role-docs-feature-desc" />
              </td>
              {ROLE_DOCS_PERSONAS.map((persona) => (
                <td key={persona} className="role-docs-table__persona">
                  {feature.permissions[persona] ? (
                    <i className="bx bx-check role-docs-icon role-docs-icon--yes" title="Allowed" />
                  ) : (
                    <i className="bx bx-x role-docs-icon role-docs-icon--no" title="Not allowed" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RoleDocsTable;
