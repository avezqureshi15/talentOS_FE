import { AlertTriangle } from "lucide-react";
import { useInterviewPlanner } from "../../hooks/use-interview-planner";
import { InterviewDesignHeader } from "../interview-design-header/interview-design-header";
import { PlannerDraftBanner } from "../planner-draft-banner/planner-draft-banner";
import { PlannerKindSwitcher } from "../planner-kind-switcher/planner-kind-switcher";
import { SectionDetailEditor } from "../section-detail-editor/section-detail-editor";
import { SectionListSidebar } from "../section-list-sidebar/section-list-sidebar";
import "./interview-design-planner.css";

export interface InterviewDesignPlannerProps {
  hiringRequestId: string;
}

export const InterviewDesignPlanner = ({ hiringRequestId }: InterviewDesignPlannerProps) => {
  const planner = useInterviewPlanner(hiringRequestId);

  if (planner.loadError) {
    return (
      <div className="idp-error">
        <AlertTriangle size={18} />
        <span>Could not load interview design.</span>
        <button type="button" className="idp-retry-btn" onClick={() => planner.refetch()}>
          Retry
        </button>
      </div>
    );
  }

  const selectedSection = planner.selectedSection;
  const isDraft = planner.saveResult?.sync_status === "draft";

  return (
    <div className="idp-planner">
      <InterviewDesignHeader
        totalMinutes={planner.totalMinutes}
        targetMinutes={planner.targetMinutes}
        timeStatus={planner.timeStatus}
        questionCount={planner.questionCount}
        isSaving={planner.isSaving}
        onSave={planner.handleSave}
        onClose={() => planner.setEditing(false)}
      />
      <PlannerKindSwitcher activeKind={planner.activeKind} onKindChange={planner.setActiveKind} />
      {isDraft && <PlannerDraftBanner errors={planner.saveResult?.sync_errors ?? []} />}
      <div className="idp-body">
        <SectionListSidebar
          sections={planner.sections}
          selectedSectionId={selectedSection?.id ?? null}
          onSelect={planner.selectSection}
          onAdd={planner.handleAddSection}
          onMove={planner.handleMoveSection}
        />
        {selectedSection ? (
          <SectionDetailEditor
            section={selectedSection}
            maxQuestionMinutes={planner.maxQuestionMinutes}
            onUpdateSection={planner.handleUpdateSection}
            onDeleteSection={() => planner.handleDeleteSection(selectedSection.id)}
            onAddQuestion={planner.handleAddQuestion}
            onUpdateQuestion={planner.handleUpdateQuestion}
            onDeleteQuestion={planner.handleDeleteQuestion}
            onDuplicateQuestion={planner.handleDuplicateQuestion}
            onMoveQuestion={planner.handleMoveQuestion}
          />
        ) : (
          <div className="idp-body-empty">
            Add a section from the sidebar to start designing.
          </div>
        )}
      </div>
    </div>
  );
};
