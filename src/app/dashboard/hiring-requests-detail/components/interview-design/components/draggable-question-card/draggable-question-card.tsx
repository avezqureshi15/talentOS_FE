import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, Copy, GripVertical, Trash2 } from "lucide-react";
import {
  MAX_QUESTION_SCORE,
  MIN_QUESTION_MINUTES,
  MIN_QUESTION_SCORE,
} from "../../interview-design.constants";
import { DRAGGABLE_QUESTION_CARD_LABELS } from "./draggable-question-card.constants";
import type { DraggableQuestionCardProps } from "./draggable-question-card.types";
import "./draggable-question-card.css";

export const DraggableQuestionCard = ({
  question,
  maxMinutes,
  onUpdate,
  onDelete,
  onDuplicate,
}: DraggableQuestionCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const labels = DRAGGABLE_QUESTION_CARD_LABELS;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`dq-card${isDragging ? " dq-card--dragging" : ""}`}
    >
      <div className="dq-card-main">
        <button
          type="button"
          className="dq-drag-handle"
          aria-label="Drag question"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={14} />
        </button>
        <textarea
          className="dq-question-input"
          value={question.question}
          placeholder={labels.QUESTION_PLACEHOLDER}
          rows={2}
          onChange={(event) => onUpdate({ question: event.target.value })}
        />
      </div>
      <div className="dq-card-footer">
        <label className="dq-field">
          <span className="dq-field-label">
            <Clock size={11} />
            {labels.MINUTES_LABEL}
          </span>
          <input
            className="dq-number-input"
            type="number"
            min={MIN_QUESTION_MINUTES}
            max={maxMinutes}
            value={question.timeAllocationMinutes}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (value >= MIN_QUESTION_MINUTES && value <= maxMinutes) {
                onUpdate({ timeAllocationMinutes: value });
              }
            }}
          />
        </label>
        <label className="dq-field">
          <span className="dq-field-label">{labels.SCORE_LABEL}</span>
          <input
            className="dq-number-input"
            type="number"
            min={MIN_QUESTION_SCORE}
            max={MAX_QUESTION_SCORE}
            value={question.score}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (value >= MIN_QUESTION_SCORE && value <= MAX_QUESTION_SCORE) {
                onUpdate({ score: value });
              }
            }}
          />
        </label>
        <div className="dq-actions">
          <button type="button" className="dq-icon-btn" onClick={onDuplicate} title={labels.DUPLICATE}>
            <Copy size={14} />
          </button>
          <button type="button" className="dq-icon-btn dq-icon-btn--danger" onClick={onDelete} title={labels.DELETE}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
