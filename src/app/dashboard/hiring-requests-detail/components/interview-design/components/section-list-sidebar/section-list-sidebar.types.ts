import type { PlannerSection } from "../../interview-design.types";

export interface SectionListSidebarProps {
  sections: PlannerSection[];
  selectedSectionId: string | null;
  showMinutes?: boolean;
  onSelect: (sectionId: string) => void;
  onAdd: () => void;
  onMove: (activeId: string, overId: string) => void;
}
