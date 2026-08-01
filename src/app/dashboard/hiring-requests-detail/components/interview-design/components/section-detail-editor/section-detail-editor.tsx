import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Clock, Plus, Trash2 } from "lucide-react";
import {
  SECTION_DEPTH_OPTIONS,
  SECTION_TYPE_OPTIONS,
} from "../../interview-design.constants";
import { DraggableQuestionCard } from "../draggable-question-card/draggable-question-card";
import { SECTION_DETAIL_EDITOR_LABELS } from "./section-detail-editor.constants";
import type { SectionDetailEditorProps } from "./section-detail-editor.types";
import "./section-detail-editor.css";

export const SectionDetailEditor = ({
  section,
  maxQuestionMinutes,
  onUpdateSection,
  onDeleteSection,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onMoveQuestion,
}: SectionDetailEditorProps) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const labels = SECTION_DETAIL_EDITOR_LABELS;
  const totalMinutes = section.questions.reduce(
    (sum, question) => sum + question.timeAllocationMinutes,
    0,
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onMoveQuestion(String(active.id), String(over.id));
    }
  };

  return (
    <div className="sde-editor">
      <div className="sde-form">
        <div className="sde-field">
          <label className="sde-label" htmlFor="sde-title">
            {labels.TITLE_LABEL}
          </label>
          <input
            id="sde-title"
            className="sde-input"
            value={section.title}
            placeholder={labels.TITLE_PLACEHOLDER}
            onChange={(event) => onUpdateSection({ title: event.target.value })}
          />
        </div>
        <div className="sde-field">
          <label className="sde-label" htmlFor="sde-type">
            {labels.TYPE_LABEL}
          </label>
          <select
            id="sde-type"
            className="sde-select"
            value={section.type}
            onChange={(event) => onUpdateSection({ type: event.target.value as typeof section.type })}
          >
            {SECTION_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="sde-field">
          <label className="sde-label" htmlFor="sde-depth">
            {labels.DEPTH_LABEL}
          </label>
          <select
            id="sde-depth"
            className="sde-select"
            value={section.depth}
            onChange={(event) => onUpdateSection({ depth: event.target.value })}
          >
            {SECTION_DEPTH_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="sde-field sde-field--description">
        <label className="sde-label" htmlFor="sde-description">
          {labels.DESCRIPTION_LABEL}
        </label>
        <textarea
          id="sde-description"
          className="sde-textarea"
          value={section.description}
          placeholder={labels.DESCRIPTION_PLACEHOLDER}
          rows={3}
          onChange={(event) => onUpdateSection({ description: event.target.value })}
        />
      </div>

      <div className="sde-section-heading">
        <span className="sde-questions-label">
          {labels.QUESTIONS_LABEL}
          <span className="sde-questions-meta">
            <Clock size={11} />
            {totalMinutes} {labels.MINUTES_SUFFIX}
          </span>
        </span>
        <div className="sde-section-actions">
          <button type="button" className="sde-add-question-btn" onClick={onAddQuestion}>
            <Plus size={13} />
            {labels.ADD_QUESTION}
          </button>
          <button
            type="button"
            className="sde-delete-section-btn"
            onClick={onDeleteSection}
            title={labels.DELETE_SECTION}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="sde-question-list">
        {section.questions.length === 0 ? (
          <div className="sde-empty">{labels.EMPTY_QUESTIONS}</div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={section.questions.map((q) => q.id)}
              strategy={verticalListSortingStrategy}
            >
              {section.questions.map((question) => (
                <DraggableQuestionCard
                  key={question.id}
                  question={question}
                  maxMinutes={maxQuestionMinutes}
                  onUpdate={(patch) => onUpdateQuestion(question.id, patch)}
                  onDelete={() => onDeleteQuestion(question.id)}
                  onDuplicate={() => onDuplicateQuestion(question.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};
