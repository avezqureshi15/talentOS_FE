import { useEffect, useMemo, useRef } from "react";
import { useInterviewPlannerStore } from "@/store/interview-planner.store";
import { MAX_QUESTION_MINUTES, SCREENING_MAX_QUESTION_MINUTES } from "../interview-design.constants";
import { createQuestion, createSection } from "../interview-design.mappers";
import { computeInterviewPlanStats } from "../interview-design.stats";
import type {
  InterviewPlanQuestion,
  InterviewPlanSection,
  PlannerSection,
} from "../interview-design.types";
import { useInterviewPlanData } from "./use-interview-plan-data";

export const useInterviewPlanner = (hiringRequestId: string) => {
  const { data, isLoading, error, refetch, save } = useInterviewPlanData(hiringRequestId);

  const activeKind = useInterviewPlannerStore((s) => s.activeKind);
  const interviewPlan = useInterviewPlannerStore((s) => s.interviewPlan);
  const screeningPlan = useInterviewPlannerStore((s) => s.screeningPlan);
  const selectedSectionId = useInterviewPlannerStore((s) => s.selectedSectionId);
  const isEditing = useInterviewPlannerStore((s) => s.isEditing);
  const setEditing = useInterviewPlannerStore((s) => s.setEditing);
  const setActiveKind = useInterviewPlannerStore((s) => s.setActiveKind);
  const setPlan = useInterviewPlannerStore((s) => s.setPlan);
  const selectSection = useInterviewPlannerStore((s) => s.selectSection);
  const addSection = useInterviewPlannerStore((s) => s.addSection);
  const updateSection = useInterviewPlannerStore((s) => s.updateSection);
  const deleteSection = useInterviewPlannerStore((s) => s.deleteSection);
  const moveSection = useInterviewPlannerStore((s) => s.moveSection);
  const addQuestion = useInterviewPlannerStore((s) => s.addQuestion);
  const updateQuestion = useInterviewPlannerStore((s) => s.updateQuestion);
  const deleteQuestion = useInterviewPlannerStore((s) => s.deleteQuestion);
  const duplicateQuestion = useInterviewPlannerStore((s) => s.duplicateQuestion);
  const moveQuestion = useInterviewPlannerStore((s) => s.moveQuestion);

  const plan = activeKind === "interview" ? interviewPlan : screeningPlan;

  const seededRef = useRef(false);
  useEffect(() => {
    if (!seededRef.current && !isLoading && data) {
      seededRef.current = true;
      setPlan("interview", { sections: data.interview_sections });
      setPlan("screening", { sections: data.screening_sections });
    }
  }, [data, isLoading, setPlan]);

  const sections = useMemo<PlannerSection[]>(
    () =>
      plan.sections.map((section) => ({
        ...section,
        minutes: section.questions.reduce(
          (sum, question) => sum + question.timeAllocationMinutes,
          0,
        ),
      })),
    [plan.sections],
  );

  const maxQuestionMinutes =
    activeKind === "interview" ? MAX_QUESTION_MINUTES : SCREENING_MAX_QUESTION_MINUTES;

  const { totalMinutes, targetMinutes, timeStatus, questionCount } = computeInterviewPlanStats(
    activeKind,
    plan,
  );

  const selectedSection = useMemo(
    () => plan.sections.find((section) => section.id === selectedSectionId) ?? null,
    [plan.sections, selectedSectionId],
  );

  const handleAddSection = () => {
    addSection(activeKind, createSection());
  };

  const handleAddQuestion = () => {
    if (!selectedSectionId) return;
    addQuestion(activeKind, selectedSectionId, createQuestion(activeKind));
  };

  const handleUpdateQuestion = (
    questionId: string,
    patch: Partial<Omit<InterviewPlanQuestion, "id">>,
  ) => {
    if (!selectedSectionId) return;
    updateQuestion(activeKind, selectedSectionId, questionId, patch);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!selectedSectionId) return;
    deleteQuestion(activeKind, selectedSectionId, questionId);
  };

  const handleDuplicateQuestion = (questionId: string) => {
    if (!selectedSectionId) return;
    duplicateQuestion(activeKind, selectedSectionId, questionId);
  };

  const handleMoveQuestion = (activeId: string, overId: string) => {
    if (!selectedSectionId) return;
    moveQuestion(activeKind, selectedSectionId, activeId, overId);
  };

  const handleUpdateSection = (
    patch: Partial<Omit<InterviewPlanSection, "id" | "questions">>,
  ) => {
    if (!selectedSectionId) return;
    updateSection(activeKind, selectedSectionId, patch);
  };

  const handleDeleteSection = (sectionId: string) => {
    deleteSection(activeKind, sectionId);
  };

  const handleMoveSection = (activeId: string, overId: string) => {
    moveSection(activeKind, activeId, overId);
  };

  const handleSave = () => {
    save.mutate({
      interview_sections: interviewPlan.sections,
      screening_sections: screeningPlan.sections,
    });
  };

  return {
    activeKind,
    sections,
    selectedSection,
    totalMinutes,
    targetMinutes,
    maxQuestionMinutes,
    timeStatus,
    questionCount,
    isLoading,
    isSaving: save.isPending,
    loadError: error,
    refetch,
    isEditing,
    setEditing,
    setActiveKind,
    selectSection,
    handleAddSection,
    handleUpdateSection,
    handleDeleteSection,
    handleMoveSection,
    handleAddQuestion,
    handleUpdateQuestion,
    handleDeleteQuestion,
    handleDuplicateQuestion,
    handleMoveQuestion,
    handleSave,
    saveResult: save.data,
  };
};
