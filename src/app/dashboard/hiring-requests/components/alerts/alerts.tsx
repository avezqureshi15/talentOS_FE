import { useState, useCallback } from "react";
import AccordionCard from "@/components/shared/accordion-card/accordion-card";
import BaseModal from "@/components/ui/modal/base-modal";
import RoundsSidePanel from "@/app/dashboard/hiring-requests-detail/components/rounds-side-panel/rounds-side-panel";
import { useAlertsData } from "./hooks/use-alerts-data";
import { sendNotification } from "@/services/alerts/alerts";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import type { AlertsSubTab } from "../../pages/hiring-requests.types";
import { ALERTS_LABELS } from "./alerts.constants";
import "./alerts.css";

const Alerts = ({ sub }: { sub: AlertsSubTab }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);
  const [resolveAlertId, setResolveAlertId] = useState<string | null>(null);

  const { alerts, hasMore, isLoading, page, setPage, resolveAlert } = useAlertsData(sub);
  const addToast = useToastStore((s) => s.addToast);

  const isSlots = sub === "slots";

  const handleNotify = useCallback(
    (user_id: number, type: string) => async () => {
      const res = await sendNotification(user_id, type.toUpperCase(), true);
      return res;
    },
    [],
  );

  const handleNotifyError = useCallback(
    (err: Error) => {
      addToast(err.message, ToastType.ERROR);
    },
    [addToast],
  );

  const handleResolveConfirm = () => {
    if (resolveAlertId) {
      resolveAlert(resolveAlertId);
      setResolveAlertId(null);
    }
  };

  if (isLoading) {
    return <div className="hr-tab-placeholder">Loading...</div>;
  }

  if (alerts.length === 0) {
    return <div className="hr-tab-placeholder">{ALERTS_LABELS.NO_ALERTS}</div>;
  }

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
              if (a.round_id) {
                setSelectedRoundId(a.round_id);
              }
            }}
            onResolve={setResolveAlertId}
            onNotify={handleNotify(a.employee_id, a.type)}
            onNotifyError={handleNotifyError}
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

      <RoundsSidePanel
        open={!!selectedRoundId}
        roundId={selectedRoundId}
        onClose={() => setSelectedRoundId(null)}
        hideReviews
      />

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
