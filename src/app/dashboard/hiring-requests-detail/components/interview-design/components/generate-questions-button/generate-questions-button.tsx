import { Sparkles } from "lucide-react";
import { useGenerateQuestions } from "../../hooks/use-generate-questions";
import {
  GENERATE_QUESTIONS_BUTTON_LABELS,
  GENERATE_QUESTIONS_ERROR_FALLBACK,
} from "./generate-questions-button.constants";
import type { GenerateQuestionsButtonProps } from "./generate-questions-button.types";
import "./generate-questions-button.css";

export const GenerateQuestionsButton = ({
  hiringRequestId,
  kind,
  onGenerated,
}: GenerateQuestionsButtonProps) => {
  const { generate, isPending, errorMessage, clearError } =
    useGenerateQuestions(hiringRequestId);

  const handleGenerate = () => {
    clearError();
    generate(kind)
      .then(onGenerated)
      .catch(() => undefined);
  };

  const displayError = errorMessage || GENERATE_QUESTIONS_ERROR_FALLBACK;

  return (
    <div className="gqb-wrap">
      {errorMessage && (
        <div className="gqb-error">
          <span className="gqb-error-message">{displayError}</span>
          <button
            type="button"
            className="gqb-retry-btn"
            onClick={handleGenerate}
            disabled={isPending}
          >
            {GENERATE_QUESTIONS_BUTTON_LABELS.RETRY}
          </button>
        </div>
      )}
      <button
        type="button"
        className="gqb-button"
        onClick={handleGenerate}
        disabled={isPending}
      >
        {isPending ? (
          <span className="gqb-button-spinner" />
        ) : (
          <Sparkles className="gqb-button-icon" />
        )}
        {isPending
          ? GENERATE_QUESTIONS_BUTTON_LABELS.GENERATING
          : GENERATE_QUESTIONS_BUTTON_LABELS.DEFAULT}
      </button>
    </div>
  );
};
