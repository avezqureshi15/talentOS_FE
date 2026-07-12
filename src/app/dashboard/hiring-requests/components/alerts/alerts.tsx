import { useState } from "react";
import AccordionCard from "@/components/shared/accordion-card/accordion-card";
import BaseModal from "@/components/ui/modal/base-modal";
import { useAlertsData } from "./hooks/use-alerts-data";
import type { AlertsSubTab } from "../../hiring-requests.types";
import { ALERTS_LABELS } from "./alerts.constants";
import "./alerts.css";

const Alerts = ({ sub }: { sub: AlertsSubTab }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [panelCandidate, setPanelCandidate] = useState<string | null>(null);
  const [panelPosition, setPanelPosition] = useState<string | null>(null);
  const [resolveAlertId, setResolveAlertId] = useState<string | null>(null);

  const { alerts, hasMore, isLoading, page, setPage, resolveAlert } = useAlertsData(sub);

  if (isLoading) {
    return <div className="hr-tab-placeholder">Loading...</div>;
  }

  if (alerts.length === 0) {
    return <div className="hr-tab-placeholder">{ALERTS_LABELS.NO_ALERTS}</div>;
  }

  const isSlots = sub === "slots";

  const handleResolveConfirm = () => {
    if (resolveAlertId) {
      resolveAlert(resolveAlertId);
      setResolveAlertId(null);
    }
  };

  return (
    <>
      <div className="accordion-list">
        {alerts.map((a) => (
          <AccordionCard
            key={a.id}
            id={a.id}
            name={a.employee.name}
            email={a.employee.email}
            contactNumber={a.employee.phone}
            linkHref={isSlots ? (a.slot_link ?? "") : (a.review_link ?? "")}
            linkLabel={isSlots ? ALERTS_LABELS.SLOT_LINK : ALERTS_LABELS.REVIEW_LINK}
            isOpen={openId === a.id}
            onToggleOpen={(id) => setOpenId(openId === id ? null : id)}
            interviewLabel={isSlots ? undefined : ALERTS_LABELS.INTERVIEW}
            onViewInterview={isSlots ? undefined : () => {
              setPanelCandidate(a.interview?.candidate_name ?? "");
              setPanelPosition(a.interview?.position ?? "");
            }}
            onResolve={setResolveAlertId}
          />
        ))}
        <div className="pagination-row">
          <button className="pagination-btn" disabled={page <= 1} onClick={() => setPage(page - 1)} type="button">
            <i className="bx bx-chevron-left" /> Previous
          </button>
          <span className="pagination-info">Page {page}</span>
          <button className="pagination-btn" disabled={!hasMore} onClick={() => setPage(page + 1)} type="button">
            Next <i className="bx bx-chevron-right" />
          </button>
        </div>
      </div>

      <BaseModal
        open={!!panelCandidate}
        onClose={() => { setPanelCandidate(null); setPanelPosition(null); }}
        title="Interview Details"
        variant="slide-right"
      >
        <div className="sp-content">
          <span className="sp-badge">Review</span>
          <div className="sp-divider" />
          <div className="sp-details">
            <div className="sp-detail-item">
              <span className="sp-detail-label">Candidate</span>
              <span className="sp-detail-value">{panelCandidate}</span>
            </div>
            <div className="sp-detail-item">
              <span className="sp-detail-label">Position</span>
              <span className="sp-detail-value">{panelPosition}</span>
            </div>
          </div>
        </div>
      </BaseModal>

      <BaseModal
        open={!!resolveAlertId}
        onClose={() => setResolveAlertId(null)}
        title="Resolve Alert"
      >
        <div className="resolve-modal-body">
          <p className="resolve-modal-text">
            Are you sure you want to mark this alert as resolved? This action cannot be undone.
          </p>
          <div className="resolve-modal-actions">
            <button className="resolve-modal-btn resolve-modal-btn--cancel" onClick={() => setResolveAlertId(null)} type="button">
              Cancel
            </button>
            <button className="resolve-modal-btn resolve-modal-btn--confirm" onClick={handleResolveConfirm} type="button">
              Resolve
            </button>
          </div>
        </div>
      </BaseModal>
    </>
  );
};

export default Alerts;
