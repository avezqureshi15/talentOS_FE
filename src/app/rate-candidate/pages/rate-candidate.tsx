import { useState, useCallback, useEffect, useMemo } from "react";
import { Icon } from "@/components/ui/icons";
import Button from "@/components/ui/button/button";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorFallback from "@/components/ui/error-fallback/error-fallback";
import RatingPanel from "@/app/rate-candidate/components/rating-panel/rating-panel";
import SkillChips from "@/app/rate-candidate/components/skill-chips/skill-chips";
import VerdictButtons from "@/app/rate-candidate/components/verdict-buttons/verdict-buttons";
import type { VerdictValue } from "@/app/rate-candidate/components/verdict-buttons/verdict-buttons.types";
import { RATE_LABELS } from "./rate-candidate.constants";
import {
  NOTES_MAX_CHARS,
  RUBRIC_LEVELS,
} from "@/app/rate-candidate/components/rating-panel/rating-panel.constants";
import {
  allQuestionsScored,
  averageScore,
  buildEmptyAnswers,
  phasesKey,
} from "@/app/rate-candidate/components/rating-panel/rating-panel.helpers";
import { SKILL_CHIPS } from "@/app/rate-candidate/components/skill-chips/skill-chips.constants";
import { CONTEXT_SECTIONS } from "./rate-candidate.constants";
import { useRateCandidate } from "../hooks/use-rate-candidate";
import type { AnswerMap } from "@/app/rate-candidate/services/rate-candidate.types";
import "./rate-candidate.css";

const RateCandidate = () => {
  const {
    formId,
    formLoading,
    formError,
    formValid,
    formValidated,
    resolvedQuestions,
    roundDetail,
    roundLoading,
    isSubmitting,
    isSubmitted,
    submitError,
    handleSubmitReview,
  } = useRateCandidate();

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [verdict, setVerdict] = useState<VerdictValue | null>(null);

  const phasesFingerprint = useMemo(
    () => (resolvedQuestions ? phasesKey(resolvedQuestions.phases) : ""),
    [resolvedQuestions],
  );

  useEffect(() => {
    if (!resolvedQuestions) return;
    setAnswers(buildEmptyAnswers(resolvedQuestions.phases));
  }, [phasesFingerprint, resolvedQuestions]);

  const handleChangeScore = useCallback((key: string, score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: { score, notes: prev[key]?.notes ?? "" },
    }));
  }, []);

  const handleChangeNotes = useCallback((key: string, notes: string) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: { score: prev[key]?.score ?? 0, notes },
    }));
  }, []);

  const handleToggleSkill = useCallback((key: string) => {
    setSelectedSkills((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    );
  }, []);

  const handleVerdict = useCallback((value: VerdictValue) => {
    setVerdict(value);
  }, []);

  const handleClear = useCallback(() => {
    if (resolvedQuestions) {
      setAnswers(buildEmptyAnswers(resolvedQuestions.phases));
    }
    setSelectedSkills([]);
    setVerdict(null);
  }, [resolvedQuestions]);

  const handleSubmit = useCallback(async () => {
    if (!verdict || !resolvedQuestions) return;
    try {
      await handleSubmitReview(
        resolvedQuestions.phases,
        resolvedQuestions.questions_source,
        answers,
        selectedSkills,
        verdict,
      );
    } catch {
      // error surfaced by submitError
    }
  }, [verdict, resolvedQuestions, answers, selectedSkills, handleSubmitReview]);

  if (formLoading || (!formValidated && !!formId)) {
    return (
      <div className="rate-page"><LoadingSpinner /></div>
    );
  }

  if (formError) {
    return (
      <div className="rate-page">
        <ErrorFallback title="Review Form" message={formError} />
      </div>
    );
  }

  if (!formValid || !formId || !resolvedQuestions) {
    return (
      <div className="rate-page">
        <ErrorFallback title="Review Form" message="Invalid review link." />
      </div>
    );
  }

  if (isSubmitted) {
    const avg = averageScore(answers);
    const avgLabel = avg > 0 ? avg.toFixed(1) : "—";
    const labelMap: Record<VerdictValue, string> = { selected: "Selected", rejected: "Rejected" };
    return (
      <div className="rate-page">
        <div className="rate-submitted">
          <i className="bx bx-check-circle submitted-icon" />
          <h2 className="submitted-title">{RATE_LABELS.SUBMITTED_TITLE}</h2>
          <p className="submitted-desc">Average Rating: {avgLabel}/5</p>
          {verdict && <p className="submitted-verdict">{labelMap[verdict]}</p>}
        </div>
      </div>
    );
  }

  const dynamicSections = roundDetail
    ? [
        { type: "brand" as const },
        { type: "divider" as const },
        { type: "badge" as const, text: roundDetail.round ?? "Interview" },
        { type: "title" as const, text: roundDetail.candidate ?? "Candidate" },
        {
          type: "meta" as const,
          items: [
            ...(roundDetail.role ? [{ icon: "bx bx-briefcase" as const, text: roundDetail.role }] : []),
            ...(roundDetail.occurred_on ? [{ icon: "bx bx-calendar" as const, text: `Interviewed: ${roundDetail.occurred_on}` }] : []),
            ...(roundDetail.interviewer ? [{ icon: "bx bx-user" as const, text: `Interviewer: ${roundDetail.interviewer}` }] : []),
          ],
        },
        { type: "divider" as const },
        {
          type: "note" as const,
          icon: "bx bx-info-circle" as const,
          heading: "Guidelines",
          text: "Rate each criterion honestly. Your feedback helps the team make an informed hiring decision. All responses are confidential.",
        },
      ]
    : CONTEXT_SECTIONS;

  const canSubmit =
    allQuestionsScored(resolvedQuestions.phases, answers) &&
    verdict !== null &&
    !isSubmitting;

  return (
    <div className="rate-page">
      <div className="rate-layout">
        <aside className="rate-context">
          <div className="context-body">
            {dynamicSections.map((section, i) => {
              switch (section.type) {
                case "brand":
                  return <div key={i} className="context-brand"><Icon.Logo /></div>;
                case "divider":
                  return <div key={i} className="context-divider" />;
                case "badge":
                  return <span key={i} className="context-badge">{section.text}</span>;
                case "title":
                  return <h2 key={i} className="context-role">{section.text}</h2>;
                case "meta":
                  return (
                    <div key={i} className="context-meta">
                      {section.items.map((item, j) => (
                        <div key={j} className="context-meta-item">
                          <i className={item.icon} />
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  );
                case "note":
                  return (
                    <div key={i} className="context-note">
                      <div className="context-note-heading">
                        <i className={section.icon} />
                        <span>{section.heading}</span>
                      </div>
                      <p>{section.text}</p>
                    </div>
                  );
              }
            })}
          </div>
        </aside>

        <main className="rate-action">
          {roundLoading && <LoadingSpinner />}

          {!roundLoading && (
            <>
              <div className="rate-scroll">
                <div className="action-header">
                  <h1 className="action-title">{RATE_LABELS.TITLE}</h1>
                  <span className="action-subtitle">{RATE_LABELS.SUBTITLE}</span>
                </div>

                <div className="rate-main">
                  <RatingPanel
                    phases={resolvedQuestions.phases}
                    answers={answers}
                    onChangeScore={handleChangeScore}
                    onChangeNotes={handleChangeNotes}
                    levels={[...RUBRIC_LEVELS]}
                    notesMaxChars={NOTES_MAX_CHARS}
                  />

                  <div className="rate-divider" />

                  <SkillChips
                    title="Hard Skills Verified"
                    chips={[...SKILL_CHIPS]}
                    selected={selectedSkills}
                    onToggle={handleToggleSkill}
                  />

                  <div className="rate-divider" />

                  <VerdictButtons
                    value={verdict}
                    onChange={handleVerdict}
                  />
                </div>
              </div>

              <div className="rate-bottom-bar">
                {submitError && <span className="rate-error">{submitError}</span>}
                <button className="rate-clear-btn" onClick={handleClear} type="button" disabled={isSubmitting}>
                  <i className="bx bx-refresh" />
                  {RATE_LABELS.CLEAR}
                </button>
                <Button className="rate-submit-btn" onClick={handleSubmit} disabled={!canSubmit} loading={isSubmitting} loadingText="Submitting..." icon="bx-send">
                  {RATE_LABELS.SUBMIT}
                </Button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default RateCandidate;
