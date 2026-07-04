import type { WizardStage, Token } from "../../types";
import { getStageHeader } from "../../utils";

type PopupHeaderProps = {
  canGoBack: boolean;
  goBack: () => void;
  currentLevelTitle: string;
  isWizardActive: boolean;
  wizardStage: WizardStage;
  tokens: Token[];
  multiLength: number;
};

const MentionPopupHeader = ({
  canGoBack, goBack, currentLevelTitle, isWizardActive, wizardStage, tokens, multiLength,
}: PopupHeaderProps) => {
  if (!canGoBack && !isWizardActive && multiLength === 0) return null;

  return (
    <div className="mp-header">
      {canGoBack && (
        <button className="mp-back" onClick={goBack} type="button">
          <i className="bx bx-chevron-left" />
          <span>{currentLevelTitle}</span>
        </button>
      )}
      {isWizardActive && (
        <span className="mp-wizard-step-label">{getStageHeader(wizardStage, tokens)}</span>
      )}
      {multiLength > 0 && (
        <span className="mp-counter-pill">Selected ({multiLength}/10)</span>
      )}
    </div>
  );
};

export default MentionPopupHeader;
