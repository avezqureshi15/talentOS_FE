import BaseModal from "@/components/ui/modal/base-modal";
import type { ApplicantDetailsModalProps } from "./applicant-details-modal.types";
import { APPLICANT_DETAILS_MODAL, LABEL_MAP, VALUE_SUFFIX } from "./applicant-details-modal.constants";
import { APPLICANT_LABELS } from "@/constants/constants";
import "./applicant-details-modal.css"

const ApplicantDetailsModal = ({ open, applicantName, details, onClose, isRemote = false }: ApplicantDetailsModalProps) => {
  const remoteValue = isRemote ? APPLICANT_LABELS.JOB_IS_REMOTE : details.willingToRelocate;

  return (
    <BaseModal open={open} onClose={onClose} title={`${APPLICANT_DETAILS_MODAL.TITLE_PREFIX}${applicantName}`} icon="bx-detail" className="ad-modal">
      <div className="ad-body">
        <div className="ad-grid">
          {(Object.keys(LABEL_MAP) as (keyof typeof LABEL_MAP)[]).map((key) => {
            const value = key === "willingToRelocate" ? remoteValue : details[key];
            if (!value) return null;
            const suffix = key === "noticePeriod" && value === "immediate" ? "" : VALUE_SUFFIX[key] ?? "";
            const isRemoteBadge = isRemote && key === "willingToRelocate";
            return (
              <div className="ad-row" key={key}>
                <span className="ad-label">{LABEL_MAP[key]}</span>
                <span className={`ad-value${isRemoteBadge ? " ad-value--remote" : ""}`}>{value === "immediate" ? APPLICANT_DETAILS_MODAL.IMMEDIATE : value}{suffix}</span>
              </div>
            );
          })}
          {(!details.currentCtc && !details.expectedCtc && !details.location && !details.yearsOfExperience && !details.noticePeriod && !details.howDidYouHear && !remoteValue) && (
            <div className="ad-row ad-row--empty">
              <span className="ad-value ad-value--empty">{APPLICANT_DETAILS_MODAL.NO_DETAILS}</span>
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default ApplicantDetailsModal;
