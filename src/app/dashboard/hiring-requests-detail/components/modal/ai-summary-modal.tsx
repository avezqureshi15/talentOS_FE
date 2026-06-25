import BaseModal from "@/components/ui/modal/base-modal";
import type { AiSummaryModalProps } from "./ai-summary-modal.types";
import { AI_SUMMARY_MODAL } from "./ai-summary-modal.constants";
import "./ai-summary-modal.css"

const AiSummaryModal = ({ open, applicantName, aiSummary, onClose }: AiSummaryModalProps) => (
  <BaseModal open={open} onClose={onClose} title={`${AI_SUMMARY_MODAL.TITLE_PREFIX}${applicantName}`} icon="bx-star" className="ai-modal">
    <div className="ai-body">
      <div className="ai-text">{aiSummary}</div>
    </div>
  </BaseModal>
);

export default AiSummaryModal;
