import BaseModal from "@/components/ui/modal/base-modal";
import "./bulk-archive-modal.css";

type CloseJobModalProps = {
  open: boolean;
  isActive: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function CloseJobModal({ open, isActive, loading, onClose, onConfirm }: CloseJobModalProps) {
  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="bam-body">
        <h3 className="bam-title">{isActive ? "Close this job?" : "Re-open this job?"}</h3>
        <p className="bam-desc">
          {isActive
            ? "This job will be marked as closed and will no longer appear as active. You can re-open it at any time."
            : "This job will be marked as active and will appear in the open jobs list again."}
        </p>
        <div className="bam-actions">
          <button onClick={onClose} className="bam-btn bam-btn--cancel" type="button" disabled={loading}>
            Cancel
          </button>
          <button onClick={onConfirm} className="bam-btn bam-btn--confirm" type="button" disabled={loading}>
            {loading ? "Saving..." : isActive ? "Close Job" : "Re-open Job"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
