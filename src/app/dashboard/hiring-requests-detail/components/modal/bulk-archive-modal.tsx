import BaseModal from "@/components/ui/modal/base-modal";
import "./bulk-archive-modal.css";

type BulkArchiveModalProps = {
  open: boolean;
  count: number;
  restore?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function BulkArchiveModal({ open, count, restore = false, onClose, onConfirm }: BulkArchiveModalProps) {
  const verb = restore ? "restore" : "archive";
  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="bam-body">
        <h3 className="bam-title">{restore ? "Restore candidates" : "Archive candidates"}</h3>
        <p className="bam-desc">
          {count} candidate{count !== 1 ? "s" : ""} will be {verb}d and removed from the active pipeline.
          {restore ? " They will reappear in their previous stage." : " You can restore them anytime from Archived Candidates."}
        </p>
        <div className="bam-actions">
          <button onClick={onClose} className="bam-btn bam-btn--cancel" type="button">Cancel</button>
          <button onClick={onConfirm} className="bam-btn bam-btn--confirm" type="button">{restore ? "Restore" : "Archive"}</button>
        </div>
      </div>
    </BaseModal>
  );
}
