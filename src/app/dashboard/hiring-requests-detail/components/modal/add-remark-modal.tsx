import { useEffect, useRef, useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import { ADD_REMARK_MODAL } from "./add-remark-modal.constants";
import type { AddRemarkModalProps } from "./add-remark-modal.types";
import "./add-remark-modal.css";

export default function AddRemarkModal({
  open,
  onClose,
  onSave,
}: AddRemarkModalProps) {
  // justification: controlled textarea value for the remark input
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement | null>(null);

  // Focus the textarea when the modal opens; clean up timeout on unmount
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => ref.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <BaseModal open={open} onClose={onClose} title={ADD_REMARK_MODAL.TITLE} icon="bx-notepad" className="remark-modal">
      <div className="remark-body">
        <textarea
          ref={ref}
          className="remark-input"
          placeholder={ADD_REMARK_MODAL.PLACEHOLDER}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="remark-footer">
        <div className="hint">
          <i className="bx bx-info-circle"></i>
          {ADD_REMARK_MODAL.HINT}
        </div>
        <div className="actions">
          <button className="ghost" onClick={onClose}>
            {ADD_REMARK_MODAL.CANCEL_LABEL}
          </button>
          <button
            className="primary"
            onClick={() => {
              if (!text.trim()) return;
              onSave(text);
              setText("");
              onClose();
            }}
          >
            {ADD_REMARK_MODAL.SAVE_LABEL}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
