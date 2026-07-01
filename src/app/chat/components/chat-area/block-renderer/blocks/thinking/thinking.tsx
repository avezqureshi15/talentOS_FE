import { useState, useEffect, useRef } from "react";
import "./thinking.css";
import { useChatStore } from "@/store/chat.store";
import type { Props } from "./thinking.types";

const ThinkingChip: React.FC<Props> = ({ text }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [visibleLength, setVisibleLength] = useState(0);
  const prevTextRef = useRef(text);
  const isProcessing = useChatStore((s) => s.isProcessing);
  const prevProcessingRef = useRef(isProcessing);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (prevProcessingRef.current && !isProcessing) {
      setIsOpen(false);
    }
    prevProcessingRef.current = isProcessing;
  }, [isProcessing]);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      if (!isProcessing) {
        setVisibleLength(text.length);
      }
    }
  }, [isProcessing, text.length]);

  useEffect(() => {
    if (text !== prevTextRef.current) {
      setVisibleLength(isProcessing ? 0 : text.length);
      prevTextRef.current = text;
    }
  }, [text, isProcessing]);

  useEffect(() => {
    if (!isProcessing) return;
    if (visibleLength < text.length) {
      const id = setInterval(() => {
        setVisibleLength((v) => Math.min(v + 1, text.length));
      }, 18);
      return () => clearInterval(id);
    }
  }, [text, visibleLength, isProcessing]);

  const displayed = text.slice(0, visibleLength);

  return (
    <div className="cui-fade-up thinking-section">
      <button
        className="thinking-section__header"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <svg
          className="thinking-section__icon"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
        <span className="thinking-section__title">Thinking</span>
        <svg
          className={`thinking-section__chevron${isOpen ? " open" : ""}`}
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && <div className="thinking-section__content">{displayed}</div>}
    </div>
  );
};

export default ThinkingChip;
