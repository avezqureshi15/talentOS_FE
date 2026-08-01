import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, GripVertical, Plus } from "lucide-react";
import type { PlannerSection } from "../../interview-design.types";
import { SECTION_LIST_SIDEBAR_LABELS } from "./section-list-sidebar.constants";
import type { SectionListSidebarProps } from "./section-list-sidebar.types";
import "./section-list-sidebar.css";

const sectionTypeClass = (type: string): string =>
  type.toLowerCase().replace(/[^a-z0-9]+/g, "-");

interface SectionItemProps {
  section: PlannerSection;
  isSelected: boolean;
  onSelect: () => void;
}

const SectionItem = ({ section, isSelected, onSelect }: SectionItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`idls-item${isSelected ? " idls-item--selected" : ""}${isDragging ? " idls-item--dragging" : ""}`}
      onClick={onSelect}
    >
      <button
        type="button"
        className="idls-drag-handle"
        aria-label="Drag section"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </button>
      <div className="idls-item-main">
        <span className="idls-item-title">{section.title || "Untitled"}</span>
        <span className="idls-item-meta">
          <span className={`idls-type idls-type--${sectionTypeClass(section.type)}`}>
            {section.type}
          </span>
          <span className="idls-item-stats">
            <Clock size={11} />
            {section.minutes} {SECTION_LIST_SIDEBAR_LABELS.MINUTES_SUFFIX} · {section.questions.length}{" "}
            {SECTION_LIST_SIDEBAR_LABELS.QUESTION_COUNT_SUFFIX}
          </span>
        </span>
      </div>
    </div>
  );
};

export const SectionListSidebar = ({
  sections,
  selectedSectionId,
  onSelect,
  onAdd,
  onMove,
}: SectionListSidebarProps) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onMove(String(active.id), String(over.id));
    }
  };

  return (
    <aside className="idls-sidebar">
      <div className="idls-heading">
        <span>{SECTION_LIST_SIDEBAR_LABELS.HEADING}</span>
        <button type="button" className="idls-add-btn" onClick={onAdd}>
          <Plus size={13} />
          {SECTION_LIST_SIDEBAR_LABELS.ADD_SECTION}
        </button>
      </div>
      <div className="idls-list">
        {sections.length === 0 ? (
          <div className="idls-empty">{SECTION_LIST_SIDEBAR_LABELS.EMPTY}</div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              {sections.map((section) => (
                <SectionItem
                  key={section.id}
                  section={section}
                  isSelected={section.id === selectedSectionId}
                  onSelect={() => onSelect(section.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </aside>
  );
};
