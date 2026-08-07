import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronDown, Info } from "lucide-react";
import { useOutletContext, useParams } from "react-router-dom";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import { useTooltip } from "@/components/shared/tooltip/use-tooltip";
import { TooltipContent } from "@/components/shared/tooltip/tooltip";
import { fadeSlideUp } from "@/utils/motion";
import { useInterviewPlannerStore } from "@/store/interview-planner.store";
import { useInterviewPlanData } from "@/app/dashboard/hiring-requests-detail/components/interview-design/hooks/use-interview-plan-data";
import { InterviewDesignPlanner } from "@/app/dashboard/hiring-requests-detail/components/interview-design/components/interview-design-planner/interview-design-planner";
import { formatMinutes } from "@/app/dashboard/hiring-requests-detail/components/interview-design/interview-design.utils";
import CallWindowModal from "@/app/dashboard/hiring-requests-detail/components/call-window/call-window-modal";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/constants/permissions";
import type { HeaderActionConfig } from "@/store/header.store";
import type { HiringRequestContext } from "./hiring-request-layout";
import "./pages.css";

type TabKey = "screening" | "interview" | "review";

const TAB_KEYS: { key: TabKey; label: string }[] = [
  { key: "screening", label: "AI Screening Questions" },
  { key: "interview", label: "AI Interview Questions" },
  { key: "review", label: "Candidate Review Questions" },
];

const TAB_TOOLTIPS: Record<TabKey, string> = {
  screening:
    "These questions will be asked during the initial screening phone call with the candidate.",
  interview: "These questions will be asked during the interview.",
  review:
    "These questions are given to the interviewer to rate the candidate. Questions generated from the interview transcript take priority; if that generation fails, the static questions shown below are used instead.",
};

const TabInfoTip = ({ tip }: { tip: string }) => {
  const { anchorRef, visible, position, anchorRect, triggerProps } = useTooltip<HTMLSpanElement>();
  return (
    <>
      <span ref={anchorRef} className="id-tab-info" {...triggerProps}>
        <Info size={13} aria-hidden="true" />
      </span>
      {visible && anchorRect && (
        <TooltipContent anchorRect={anchorRect} position={position} className="id-tab-tooltip">
          {tip}
        </TooltipContent>
      )}
    </>
  );
};

const contentVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const InterviewDesignPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useOutletContext<HiringRequestContext>();
  const { can } = usePermissions();
  const canEditPlan = can(PERMISSIONS.INTERVIEW_PLAN_EDIT);
  const [activeTab, setActiveTab] = useState<TabKey>("screening");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set()
  );
  const [callWindowOpen, setCallWindowOpen] = useState(false);

  const isEditing = useInterviewPlannerStore((s) => s.isEditing);
  const setEditing = useInterviewPlannerStore((s) => s.setEditing);
  const interviewPlan = useInterviewPlannerStore((s) => s.interviewPlan);
  const screeningPlan = useInterviewPlannerStore((s) => s.screeningPlan);
  const reviewPlan = useInterviewPlannerStore((s) => s.reviewPlan);
  const { data: designData, isLoading, error, refetch, save } = useInterviewPlanData(id ?? "");

  const sections =
    activeTab === "interview" ? designData?.interview_sections ?? []
    : activeTab === "review"  ? designData?.review_sections ?? []
    : designData?.screening_sections ?? [];

  const totalMinutes = sections.reduce(
    (sum, section) =>
      sum + section.questions.reduce((qSum, question) => qSum + question.timeAllocationMinutes, 0),
    0,
  );

  const handleToggleEditing = () => {
    setEditing(!isEditing);
  };

  const handleSave = () => {
    save.mutate({
      interview_sections: interviewPlan.sections,
      screening_sections: screeningPlan.sections,
      review_sections: reviewPlan.sections,
    });
  };

  useEffect(() => {
    return () => {
      setEditing(false);
    };
  }, [setEditing]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const headerActions: HeaderActionConfig[] = isEditing
    ? [
        {
          key: "close",
          label: "Close",
          icon: "bx-x",
          variant: "outline",
          onClick: handleToggleEditing,
        },
        {
          key: "save",
          label: save.isPending ? "Saving..." : "Save Changes",
          icon: "bx-save",
          variant: "primary",
          onClick: handleSave,
          disabled: save.isPending,
        },
      ]
    : [
        { key: "export", label: "Export PDF", icon: "bx-download", variant: "primary" },
        ...(canEditPlan
          ? [{
              key: "edit",
              label: "Edit",
              icon: "bx-edit-alt",
              variant: "outline",
              onClick: handleToggleEditing,
            } as HeaderActionConfig]
          : []),
      ];

  return (
    <>
      <PageHeader
        title="Interview Design"
        hiringRequestName={data.title}
        hiringRequest={data}
        badges={canEditPlan ? [] : [{
          label: "READ ONLY",
          icon: "bx bxs-lock-alt",
          tooltip: "Only admins and job owners can edit the interview plan. You can view questions but not modify them.",
        }]}
        actions={headerActions}
      />
      <ErrorBoundary>
        {isEditing && id ? (
          <InterviewDesignPlanner hiringRequestId={id} />
        ) : (
        <div className="id-page">
          <div className="id-meta-row">
            <span className="id-meta-pill">
              {activeTab !== "review" && <Clock className="id-meta-pill-icon" />}
              {activeTab === "interview" ? "AI INTERVIEW" : activeTab === "review" ? "CANDIDATE REVIEW" : "AI SCREENING"}
              {activeTab !== "review" && formatMinutes(totalMinutes) && (
                <> &middot; {formatMinutes(totalMinutes)}</>
              )}{" "}
              &middot; {sections.length} SECTIONS
            </span>
            {id && activeTab === "screening" && (
              <div className="id-meta-actions">
                <button
                  type="button"
                  className="cw-trigger-btn"
                  onClick={() => setCallWindowOpen(true)}
                >
                  <i className="bx bx-alarm-alt" />
                  <span>Call Window</span>
                </button>
              </div>
            )}
          </div>

          <div className="id-tabs">
            {TAB_KEYS.map((t) => (
              <button
                key={t.key}
                className={`id-tab ${
                  activeTab === t.key ? "id-tab--active" : ""
                }`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
                <TabInfoTip tip={TAB_TOOLTIPS[t.key]} />
              </button>
            ))}
          </div>

          <div className="id-content">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="id-view-status">
                  <LoadingSpinner size="sm" />
                  <span>Loading interview design...</span>
                </div>
              ) : error ? (
                <div className="id-view-status id-view-status--error">
                  <span>Could not load interview design.</span>
                  <button type="button" className="id-view-retry-btn" onClick={() => refetch()}>
                    Retry
                  </button>
                </div>
              ) : (
                <motion.div
                  key={activeTab}
                  className="id-timeline"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {sections.map((sec, i) => {
                    const isOpen = expandedSections.has(sec.id);
                    const sectionMinutes = sec.questions.reduce(
                      (sum, question) => sum + question.timeAllocationMinutes,
                      0,
                    );
                    return (
                      <motion.div
                        key={sec.id}
                        className={`id-timeline-card${
                          isOpen ? " id-timeline-card--open" : ""
                        }`}
                        variants={fadeSlideUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: i * 0.06 }}
                      >
                        <div className="id-timeline-dot">
                          <span className="id-timeline-dot-inner" />
                        </div>
                        <div className="id-timeline-card-body">
                          <button
                            className="id-timeline-card-header"
                            onClick={() => toggleSection(sec.id)}
                          >
                            <div className="id-section-top">
                              <div className="id-section-meta">
                                <span className="id-section-step">
                                  {String(i + 1).padStart(2, "0")}.
                                </span>
                                <span
                                  className={`id-section-type id-section-type--${sec.type
                                    .toLowerCase()
                                    .replace(/\s+/g, "")}`}
                                >
                                  {sec.type}
                                </span>
                              </div>
                              <div className="id-section-top-right">
                                {activeTab !== "review" && (
                                  <span className="id-section-duration">
                                    {formatMinutes(sectionMinutes)}
                                  </span>
                                )}
                                <ChevronDown
                                  className={`id-section-chevron${
                                    isOpen
                                      ? " id-section-chevron--open"
                                      : ""
                                  }`}
                                />
                              </div>
                            </div>
                            <div className="id-section-body">
                              <h3 className="id-section-title">{sec.title}</h3>
                              <p className="id-section-desc">
                                {sec.description}
                              </p>
                            </div>
                          </button>

                          {isOpen && (
                            <motion.div
                              className="id-section-expanded"
                              variants={contentVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              <div className="id-section-divider" />

                              {sec.questions && sec.questions.length > 0 && (
                                <div className="id-questions">
                                  <h4 className="id-questions-heading">
                                    Questions
                                  </h4>
                                  <ol className="id-questions-list">
                                    {sec.questions.map((q) => (
                                      <li key={q.id} className="id-question">
                                        {q.question}
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              )}

                              {sec.depth && (
                                <div className="id-section-depth">
                                  <span className="id-depth-label">
                                    Assessment depth:
                                  </span>
                                  <span className="id-depth-value">
                                    {sec.depth}
                                  </span>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        )}
      </ErrorBoundary>
      {id && callWindowOpen && (
        <CallWindowModal
          open
          onClose={() => setCallWindowOpen(false)}
          hiringRequestId={id}
          canEdit={canEditPlan}
        />
      )}
    </>
  );
};

export default InterviewDesignPage;
