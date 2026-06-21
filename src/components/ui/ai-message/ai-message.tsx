import { Icon } from "@/components/ui/icons";
import "./ai-message.css";
import type { AIResponseBlockProps } from "./ai-message.types";



const AIMessage = ({
  message,
  thought,
  actions = [],
}: AIResponseBlockProps) => {
  return (
    <div className="ai-message cui-fade-up cui-d1">

      {/* Thought pill */}
      {thought && (
        <div className="ai-message-thought cui-fade-up">
          <Icon.Thought />
          <span>{thought}</span>
        </div>
      )}

      {/* AI message */}
      <p className="ai-message-text">
        {message}
      </p>

      {/* Actions */}
      {actions.length > 0 && (
        <div className="ai-message-actions">
          {actions.map(({ Icon: Ic, label, onClick }) => (
            <button
              key={label}
              title={label}
              className="ai-message-action-btn"
              onClick={onClick}
            >
              <Ic />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIMessage;