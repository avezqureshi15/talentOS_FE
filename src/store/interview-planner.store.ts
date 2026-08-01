import { create } from "zustand";
import type {
  InterviewPlan,
  InterviewPlanQuestion,
  InterviewPlanSection,
  PlanKind,
} from "@/app/dashboard/hiring-requests-detail/components/interview-design/interview-design.types";

const arrayMove = <T,>(items: T[], fromIndex: number, toIndex: number): T[] => {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

const emptyPlan: InterviewPlan = { sections: [] };

const planField = (kind: PlanKind): "interviewPlan" | "screeningPlan" =>
  kind === "interview" ? "interviewPlan" : "screeningPlan";

interface InterviewPlannerState {
  interviewPlan: InterviewPlan;
  screeningPlan: InterviewPlan;
  activeKind: PlanKind;
  selectedSectionId: string | null;
  isEditing: boolean;
  setEditing: (editing: boolean) => void;
  setActiveKind: (kind: PlanKind) => void;
  setPlan: (kind: PlanKind, plan: InterviewPlan) => void;
  selectSection: (sectionId: string) => void;
  addSection: (kind: PlanKind, section: InterviewPlanSection) => void;
  updateSection: (
    kind: PlanKind,
    sectionId: string,
    patch: Partial<Omit<InterviewPlanSection, "id" | "questions">>,
  ) => void;
  deleteSection: (kind: PlanKind, sectionId: string) => void;
  moveSection: (kind: PlanKind, activeId: string, overId: string) => void;
  addQuestion: (kind: PlanKind, sectionId: string, question: InterviewPlanQuestion) => void;
  updateQuestion: (
    kind: PlanKind,
    sectionId: string,
    questionId: string,
    patch: Partial<Omit<InterviewPlanQuestion, "id">>,
  ) => void;
  deleteQuestion: (kind: PlanKind, sectionId: string, questionId: string) => void;
  duplicateQuestion: (kind: PlanKind, sectionId: string, questionId: string) => void;
  moveQuestion: (kind: PlanKind, sectionId: string, activeId: string, overId: string) => void;
}

export const useInterviewPlannerStore = create<InterviewPlannerState>((set) => ({
  interviewPlan: emptyPlan,
  screeningPlan: emptyPlan,
  activeKind: "interview",
  selectedSectionId: null,
  isEditing: false,

  setEditing: (editing) => set({ isEditing: editing }),

  setActiveKind: (kind) =>
    set((state) => {
      const plan = state[planField(kind)];
      return {
        activeKind: kind,
        selectedSectionId: plan.sections[0]?.id ?? null,
      };
    }),

  setPlan: (kind, plan) =>
    set((state) => ({
      [planField(kind)]: plan,
      selectedSectionId:
        state.activeKind === kind ? (plan.sections[0]?.id ?? null) : state.selectedSectionId,
    })),

  selectSection: (sectionId) => set({ selectedSectionId: sectionId }),

  addSection: (kind, section) =>
    set((state) => {
      const field = planField(kind);
      const plan = state[field];
      return {
        [field]: { sections: [...plan.sections, section] },
        selectedSectionId: state.activeKind === kind ? section.id : state.selectedSectionId,
      };
    }),

  updateSection: (kind, sectionId, patch) =>
    set((state) => {
      const field = planField(kind);
      const plan = state[field];
      return {
        [field]: {
          sections: plan.sections.map((section) =>
            section.id === sectionId ? { ...section, ...patch } : section
          ),
        },
      };
    }),

  deleteSection: (kind, sectionId) =>
    set((state) => {
      const field = planField(kind);
      const plan = state[field];
      const sections = plan.sections.filter((s) => s.id !== sectionId);
      const next: Partial<InterviewPlannerState> = { [field]: { sections } };
      if (state.activeKind === kind && state.selectedSectionId === sectionId) {
        next.selectedSectionId = sections[0]?.id ?? null;
      }
      return next;
    }),

  moveSection: (kind, activeId, overId) =>
    set((state) => {
      const field = planField(kind);
      const sections = state[field].sections;
      const fromIndex = sections.findIndex((s) => s.id === activeId);
      const toIndex = sections.findIndex((s) => s.id === overId);
      if (fromIndex < 0 || toIndex < 0) return state;
      return { [field]: { sections: arrayMove(sections, fromIndex, toIndex) } };
    }),

  addQuestion: (kind, sectionId, question) =>
    set((state) => {
      const field = planField(kind);
      const plan = state[field];
      return {
        [field]: {
          sections: plan.sections.map((section) =>
            section.id === sectionId
              ? { ...section, questions: [...section.questions, question] }
              : section
          ),
        },
      };
    }),

  updateQuestion: (kind, sectionId, questionId, patch) =>
    set((state) => {
      const field = planField(kind);
      const plan = state[field];
      return {
        [field]: {
          sections: plan.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  questions: section.questions.map((q) =>
                    q.id === questionId ? { ...q, ...patch } : q
                  ),
                }
              : section
          ),
        },
      };
    }),

  deleteQuestion: (kind, sectionId, questionId) =>
    set((state) => {
      const field = planField(kind);
      const plan = state[field];
      return {
        [field]: {
          sections: plan.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  questions: section.questions.filter((q) => q.id !== questionId),
                }
              : section
          ),
        },
      };
    }),

  duplicateQuestion: (kind, sectionId, questionId) =>
    set((state) => {
      const field = planField(kind);
      const plan = state[field];
      return {
        [field]: {
          sections: plan.sections.map((section) => {
            if (section.id !== sectionId) return section;
            const index = section.questions.findIndex((q) => q.id === questionId);
            if (index < 0) return section;
            const source = section.questions[index];
            const copy: InterviewPlanQuestion = {
              ...source,
              id: crypto.randomUUID(),
            };
            const questions = [...section.questions];
            questions.splice(index + 1, 0, copy);
            return { ...section, questions };
          }),
        },
      };
    }),

  moveQuestion: (kind, sectionId, activeId, overId) =>
    set((state) => {
      const field = planField(kind);
      const plan = state[field];
      return {
        [field]: {
          sections: plan.sections.map((section) => {
            if (section.id !== sectionId) return section;
            const fromIndex = section.questions.findIndex((q) => q.id === activeId);
            const toIndex = section.questions.findIndex((q) => q.id === overId);
            if (fromIndex < 0 || toIndex < 0) return section;
            return { ...section, questions: arrayMove(section.questions, fromIndex, toIndex) };
          }),
        },
      };
    }),
}));
