import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import { APPLICANT_LABELS } from "@/constants/constants";
import { PERMISSIONS } from "@/constants/permissions";
import { usePermissions } from "@/hooks/use-permissions";
import type { ApplicantActionModalsProps } from "./applicants.types";

const ApplicantActionModals = ({
  data,
  finalCandidateId,
  finalDecision,
  onCloseFinalDecision,
  confirmFinalDecision,
  rejectConfirmId,
  rejectRemarks,
  rejectStep,
  onRejectRemarksChange,
  onRejectNextStep,
  onCloseReject,
  onConfirmReject,
  shortlistCandidateId,
  shortlistStep,
  shortlistRemarks,
  onShortlistRemarksChange,
  onShortlistOk,
  onMoveToNextRound,
  onOpenFinalSelectionWarning,
  onCloseShortlist,
  finalConfirmId,
  onFinalConfirmAction,
  onCloseFinalConfirm,
  isConfirmingFinalDecision,
  isConfirmingReject,
  isShortlisting,
  isConfirmingHire,
}: ApplicantActionModalsProps) => {
  const { can } = usePermissions();
  const canWorkflow = can(PERMISSIONS.APPLICATION_WORKFLOW);
  const canEvaluate = can(PERMISSIONS.APPLICATION_EVALUATE);
  const canReject = can(PERMISSIONS.APPLICATION_REJECT);

  const actionLabel = finalDecision === "selected"
    ? APPLICANT_LABELS.SELECT_CANDIDATE
    : finalDecision === "on-hold"
    ? "On Hold"
    : APPLICANT_LABELS.REJECT_CANDIDATE;

  return (
    <>
      <BaseModal
        open={!!finalCandidateId}
        onClose={onCloseFinalDecision}
        title={actionLabel}
      >
        <div className="confirm-body">
          <p>
            {APPLICANT_LABELS.FINAL_DECISION_CONFIRM.replace("{action}", finalDecision === "selected" ? "select" : finalDecision === "on-hold" ? "hold" : "reject")}
          </p>
          <div className="confirm-actions">
            <button className="confirm-btn confirm-cancel" onClick={onCloseFinalDecision} type="button">
              Cancel
            </button>
            <Button
              className={`confirm-btn ${finalDecision === "selected" || finalDecision === "on-hold" ? "confirm-proceed" : "confirm-danger"}`}
              onClick={confirmFinalDecision}
              loading={isConfirmingFinalDecision}
              loadingText={finalDecision === "selected" ? "Selecting..." : finalDecision === "on-hold" ? "Putting on hold..." : "Rejecting..."}
            >
              {finalDecision === "selected" ? "Select" : finalDecision === "on-hold" ? "Hold" : "Reject"}
            </Button>
          </div>
        </div>
      </BaseModal>

      {/* Reject — Step 1: HR Remarks */}
      <BaseModal
        open={!!rejectConfirmId && rejectStep === 1}
        onClose={onCloseReject}
        title={APPLICANT_LABELS.HR_REMARKS_TITLE}
      >
        <div className="confirm-body">
          <textarea
            className="remarks-textarea"
            placeholder={APPLICANT_LABELS.HR_REMARKS_PLACEHOLDER}
            value={rejectRemarks}
            onChange={(e) => onRejectRemarksChange(e.target.value)}
            rows={4}
          />
          <div className="confirm-actions">
            <button className="confirm-btn confirm-cancel" onClick={onCloseReject} type="button">
              Cancel
            </button>
            <button
              className="confirm-btn confirm-danger"
              disabled={rejectRemarks.trim() === ""}
              onClick={onRejectNextStep}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </BaseModal>

      {/* Reject — Step 2: Confirmation */}
      <BaseModal
        open={!!rejectConfirmId && rejectStep === 2}
        onClose={onCloseReject}
        title={APPLICANT_LABELS.HR_REJECT}
      >
        <div className="confirm-body">
          <p>{APPLICANT_LABELS.REJECT_WARNING}</p>
          <div className="confirm-actions">
            <button className="confirm-btn confirm-cancel" onClick={onCloseReject} type="button">Cancel</button>
            <Button className="confirm-btn confirm-danger" onClick={onConfirmReject} loading={isConfirmingReject} loadingText="Rejecting...">
              Reject
            </Button>
          </div>
        </div>
      </BaseModal>

      {/* Shortlist — Step 1: HR Remarks */}
      <BaseModal
        open={!!shortlistCandidateId && shortlistStep === 1}
        onClose={onCloseShortlist}
        title={APPLICANT_LABELS.HR_REMARKS_TITLE}
      >
        <div className="confirm-body">
          <textarea
            className="remarks-textarea"
            placeholder={APPLICANT_LABELS.HR_REMARKS_PLACEHOLDER}
            value={shortlistRemarks}
            onChange={(e) => onShortlistRemarksChange(e.target.value)}
            rows={4}
          />
          <div className="confirm-actions">
            <button className="confirm-btn confirm-cancel" onClick={onCloseShortlist} type="button">
              Cancel
            </button>
            <Button
              className="confirm-btn confirm-proceed"
              disabled={shortlistRemarks.trim() === ""}
              onClick={onShortlistOk}
              loading={isShortlisting}
              loadingText="Shortlisting..."
            >
              OK
            </Button>
          </div>
        </div>
      </BaseModal>

      {/* Shortlist — Step 2: Choose outcome */}
      <BaseModal
        open={!!shortlistCandidateId && shortlistStep === 2}
        onClose={onCloseShortlist}
        title={APPLICANT_LABELS.HR_SHORTLIST}
      >
        <div className="confirm-body">
          <p>Proceed with {data.find((a) => a.id === shortlistCandidateId)?.name ?? "candidate"}?</p>
          <div className="confirm-actions">
            <button className="confirm-btn confirm-cancel" onClick={onCloseShortlist} type="button">
              Cancel
            </button>
            {canWorkflow ? (
              <button className="confirm-btn confirm-proceed" onClick={onMoveToNextRound} type="button">
                {APPLICANT_LABELS.MOVE_TO_NEXT_ROUND}
              </button>
            ) : null}
            {canEvaluate || canReject ? (
              <button className="confirm-btn confirm-danger" onClick={onOpenFinalSelectionWarning} type="button">
                {APPLICANT_LABELS.FINAL_SELECTION}
              </button>
            ) : null}
          </div>
        </div>
      </BaseModal>

      <BaseModal
        open={!!finalConfirmId}
        onClose={onCloseFinalConfirm}
        title={APPLICANT_LABELS.FINAL_SELECTION}
      >
        <div className="confirm-body">
          <p className="warning-text">
            <i className="bx bx-error-circle"></i> {APPLICANT_LABELS.FINAL_SELECTION_WARNING}
          </p>
          <div className="confirm-actions">
            <button className="confirm-btn confirm-cancel" onClick={onCloseFinalConfirm} type="button">
              Cancel
            </button>
            {canEvaluate ? (
              <Button className="confirm-btn confirm-proceed" onClick={() => onFinalConfirmAction("selected")} loading={isConfirmingHire} loadingText="Selecting...">
                Select
              </Button>
            ) : null}
            {canReject ? (
              <Button className="confirm-btn confirm-danger" onClick={() => onFinalConfirmAction("rejected")} loading={isConfirmingHire} loadingText="Rejecting...">
                Reject
              </Button>
            ) : null}
            {canEvaluate ? (
              <button className="confirm-btn confirm-cancel" onClick={() => onFinalConfirmAction("on-hold")} type="button">
                Hold
              </button>
            ) : null}
          </div>
        </div>
      </BaseModal>
    </>
  );
};

export default ApplicantActionModals;
