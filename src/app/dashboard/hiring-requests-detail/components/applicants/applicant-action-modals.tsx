import BaseModal from "@/components/ui/modal/base-modal";
import { APPLICANT_LABELS } from "@/constants/constants";
import type { ApplicantActionModalsProps } from "./applicants.types";

const ApplicantActionModals = ({
  data,
  finalCandidateId,
  finalDecision,
  onCloseFinalDecision,
  confirmFinalDecision,
  rejectConfirmId,
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
  onConfirmHire,
  onCloseFinalConfirm,
}: ApplicantActionModalsProps) => {
  const actionLabel = finalDecision === "selected"
    ? APPLICANT_LABELS.SELECT_CANDIDATE
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
            {APPLICANT_LABELS.FINAL_DECISION_CONFIRM.replace("{action}", finalDecision === "selected" ? "select" : "reject")}
          </p>
          <div className="confirm-actions">
            <button className="confirm-btn confirm-cancel" onClick={onCloseFinalDecision} type="button">
              Cancel
            </button>
            <button
              className={`confirm-btn ${finalDecision === "selected" ? "confirm-proceed" : "confirm-danger"}`}
              onClick={confirmFinalDecision}
              type="button"
            >
              {finalDecision === "selected" ? "Select" : "Reject"}
            </button>
          </div>
        </div>
      </BaseModal>

      <BaseModal
        open={!!rejectConfirmId}
        onClose={onCloseReject}
        title={APPLICANT_LABELS.HR_REJECT}
      >
        <div className="confirm-body">
          <p>{APPLICANT_LABELS.REJECT_WARNING}</p>
          <div className="confirm-actions">
            <button className="confirm-btn confirm-cancel" onClick={onCloseReject} type="button">Cancel</button>
            <button className="confirm-btn confirm-danger" onClick={onConfirmReject} type="button">
              Reject
            </button>
          </div>
        </div>
      </BaseModal>

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
            <button className="confirm-btn confirm-proceed" onClick={onShortlistOk} type="button">
              OK
            </button>
          </div>
        </div>
      </BaseModal>

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
            <button className="confirm-btn confirm-proceed" onClick={onMoveToNextRound} type="button">
              {APPLICANT_LABELS.MOVE_TO_NEXT_ROUND}
            </button>
            <button className="confirm-btn confirm-danger" onClick={onOpenFinalSelectionWarning} type="button">
              {APPLICANT_LABELS.FINAL_SELECTION}
            </button>
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
            <button className="confirm-btn confirm-danger" onClick={onConfirmHire} type="button">
              Confirm
            </button>
          </div>
        </div>
      </BaseModal>
    </>
  );
};

export default ApplicantActionModals;
