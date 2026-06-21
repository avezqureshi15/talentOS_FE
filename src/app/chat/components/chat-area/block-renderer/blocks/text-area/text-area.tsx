import React from "react";
import "./text-area.css";
import MarkdownRenderer from "@/app/chat/components/chat-area/block-renderer/blocks/markdown/markdown";

type Props = {
  subject?: string;
  name?: string;
  meta?: string;
  content?: string; // 🔥 AI GENERATED MARKDOWN
};

const Divider = () => <div className="rl-divider" />;

const TextArea: React.FC<Props> = ({
  subject = "",
  content,
}) => {
  return (
    <div className="rl-container">
      <div className="rl-card">
        {/* Top Actions */}
        <div className="rl-actions">
          <button className="rl-icon-btn">
            <i className="ti ti-pencil" />
          </button>

          <div className="rl-actions-right">
            <button className="rl-icon-btn">
              <i className="ti ti-copy" />
            </button>
            <button className="rl-icon-btn">
              <i className="ti ti-send" />
            </button>
          </div>
        </div>

        {/* Subject */}
        <p className="rl-subject">{subject}</p>

        <Divider />

        {/* BODY (AI CONTROLLED) */}
        {content && (
          <div className="rl-ai-body">
            <MarkdownRenderer content={content} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TextArea;