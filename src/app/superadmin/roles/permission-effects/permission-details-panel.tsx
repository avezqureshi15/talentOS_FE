import BaseModal from "@/components/ui/modal/base-modal";
import { getPermissionEffect } from "./permission-effects";
import type { PermissionInfo } from "../pages/roles-page.types";
import "./permission-details-panel.css";

type Props = {
  permission: PermissionInfo | null;
  assigned: boolean;
  onClose: () => void;
  onNavigate: (code: string) => void;
};

const GROUP_LABELS: Record<string, string> = {
  application: "Applications",
  chat: "Chat",
  hiring_request: "Job Listings",
  interview: "Interview Plan",
  job: "Job Team",
  report: "Reports",
  review: "Reviews",
  settings: "Settings",
  slot: "Slots",
  tenant: "Tenants",
  user: "Users",
};

export default function PermissionDetailsPanel({
  permission,
  assigned,
  onClose,
  onNavigate,
}: Props) {
  if (!permission) return null;

  const effect = getPermissionEffect(permission.code);
  const related = (effect.related ?? []).filter((c) => c !== permission.code);

  return (
    <BaseModal
      open={true}
      onClose={onClose}
      title={permission.name}
      icon="bx bx-lock-alt"
      variant="slide-right"
      className="pdp-modal"
    >
      <div className="pdp-body">
        <div className="pdp-status-row">
          <span className={`pdp-status${assigned ? " pdp-status--on" : ""}`}>
            <i className={`bx ${assigned ? "bx-check-circle" : "bx-x-circle"}`} />
            {assigned ? "Currently enabled for this role" : "Currently disabled for this role"}
          </span>
          <span className="pdp-group">{GROUP_LABELS[permission.group] ?? permission.group}</span>
        </div>

        <section className="pdp-section">
          <h4 className="pdp-section-title">What it does</h4>
          <p className="pdp-summary">{effect.summary}</p>
        </section>

        <section className="pdp-section">
          <h4 className="pdp-section-title">What this role can do</h4>
          <ul className="pdp-list">
            {effect.whatTheyCanDo.map((item) => (
              <li key={item}><i className="bx bx-check-circle" />{item}</li>
            ))}
          </ul>
        </section>

        <section className="pdp-section pdp-section--disabled">
          <h4 className="pdp-section-title pdp-section-title--danger">
            <i className="bx bx-error-circle" />
            If you turn it OFF
          </h4>
          <p className="pdp-summary">{effect.disabled.blurb}</p>
          <ul className="pdp-list pdp-list--danger">
            {effect.disabled.lostActions.map((item) => (
              <li key={item}><i className="bx bx-x-circle" />{item}</li>
            ))}
          </ul>
        </section>

        <section className="pdp-section">
          <h4 className="pdp-section-title">What still works</h4>
          <ul className="pdp-list">
            {effect.disabled.stillWorks.map((item) => (
              <li key={item}><i className="bx bx-check-circle" />{item}</li>
            ))}
          </ul>
        </section>

        <section className="pdp-section pdp-scenario">
          <h4 className="pdp-section-title">
            <i className="bx bx-bulb" />
            Example scenario
          </h4>
          <p className="pdp-summary">{effect.scenario}</p>
        </section>

        {related.length > 0 && (
          <section className="pdp-section">
            <h4 className="pdp-section-title">Related permissions</h4>
            <div className="pdp-related">
              {related.map((code) => (
                <button
                  key={code}
                  type="button"
                  className="pdp-related-chip"
                  onClick={() => onNavigate(code)}
                >
                  {code}
                </button>
              ))}
            </div>
          </section>
        )}

        {effect.technical && (
          <section className="pdp-section">
            <details className="pdp-tech">
              <summary>
                <i className="bx bx-code-alt" />
                Technical details (how it's enforced)
              </summary>
              <p>{effect.technical}</p>
            </details>
          </section>
        )}
      </div>
    </BaseModal>
  );
}
