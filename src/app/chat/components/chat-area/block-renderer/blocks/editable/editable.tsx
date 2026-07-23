import { useState, useCallback, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { EditableBlockProps } from "./editable.types";
import { EDITABLE } from "./editable.constants";
import "./editable.css";

function useAutoResize(ref: React.RefObject<HTMLTextAreaElement | null>, value: string) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0";
    el.style.height = `${el.scrollHeight}px`;
  }, [ref, value]);
}

const LoadingSpinner = () => (
  <svg className="editable-spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const EditableBlock = ({ content, onSave, isEditing: controlledEditing, onEditRequest, onCancel, saving = false }: EditableBlockProps) => {
  const [internalEditing, setInternalEditing] = useState(false);
  const [draft, setDraft] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isEditing = controlledEditing ?? internalEditing;
  useAutoResize(textareaRef, draft);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditing]);

  const exitEditing = useCallback(() => {
    setInternalEditing(false);
  }, []);

  const handleSave = useCallback(async () => {
    const result = onSave(draft);
    if (result instanceof Promise) {
      await result;
    }
    exitEditing();
  }, [draft, onSave, exitEditing]);

  const handleCancel = useCallback(() => {
    setDraft(content);
    exitEditing();
    onCancel?.();
  }, [content, exitEditing, onCancel]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        if (!saving) handleSave();
      }
      if (e.key === "Escape") {
        e.stopPropagation();
        handleCancel();
      }
    },
    [handleSave, handleCancel, saving]
  );

  if (!isEditing) {
    return (
      <div
        ref={wrapperRef}
        className="editable-wrapper"
        onClick={() => {
          if (onEditRequest) onEditRequest();
          else setInternalEditing(true);
        }}
        tabIndex={0}
        title={EDITABLE.PLACEHOLDER}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="editable-wrapper editable-wrapper--editing">
      <textarea
        ref={textareaRef}
        className="editable-textarea"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={saving}
      />
      <div className="editable-actions">
        <button
          className="editable-btn editable-btn--save"
          onClick={handleSave}
          disabled={saving}
        >
          {saving && <LoadingSpinner />}
          {saving ? EDITABLE.SAVING_LABEL : EDITABLE.SAVE_LABEL}
        </button>
        <button
          className="editable-btn editable-btn--cancel"
          onClick={handleCancel}
          disabled={saving}
        >
          {EDITABLE.CANCEL_LABEL}
        </button>
      </div>
    </div>
  );
};

export default EditableBlock;