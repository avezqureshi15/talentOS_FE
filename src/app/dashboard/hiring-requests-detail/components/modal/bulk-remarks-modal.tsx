import { useRef, useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import "./bulk-remarks-modal.css";

type BulkRemarksModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (remarks: string) => void;
  title: string;
};

export default function BulkRemarksModal({ open, onClose, onConfirm, title }: BulkRemarksModalProps) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement | null>(null);

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="brm-body">
        <h3 className="brm-title">{title}</h3>
        <textarea
          ref={ref}
          className="brm-input"
          placeholder="Enter HR remarks for the current round..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="brm-actions">
          <button onClick={() => { setText(""); onConfirm(""); }} className="brm-btn brm-btn--skip" type="button">
            Skip
          </button>
          <button onClick={() => { setText(""); onConfirm(text); }} disabled={!text.trim()} className="brm-btn brm-btn--confirm" type="button">
            Next
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
