import React from "react";
import type { MentionPopupProps } from "@/components/shared/mentions/mentions.types";
import "./mentions.css";
import { MENTIONS_LABELS } from "./mentions.constants";

const MentionPopup: React.FC<MentionPopupProps> = ({
  show,
  data,
  activeTrigger,
  onSelect,
}) => {
  if (!show || !activeTrigger) return null;

  const groupedData = {
    applicants: data.filter((item) => item.type === "user"),
    requests: data.filter((item) => item.type !== "user"),
  };

  const renderSection = (title: string, items: typeof data) => {
    if (items.length === 0) return null;

    return (
      <>
        <div className="mention-header">{title}</div>

        {items.map((item) => {
          const label =
            item.type === "user" ? item.name : item.title;

          const meta =
            item.type === "user"
              ? item.email
              : item.description;

          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className="mention-item"
            >
              <div className="mention-avatar">
                {label.charAt(0).toUpperCase()}
              </div>

              <div className="mention-content">
                <div className="mention-label">{label}</div>
                {meta && (
                  <div className="mention-meta">{meta}</div>
                )}
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const isEmpty =
    groupedData.applicants.length === 0 &&
    groupedData.requests.length === 0;

  return (
    <div className="mention-popup">
      {isEmpty ? (
        <div className="mention-empty">{MENTIONS_LABELS.NO_RESULTS}</div>
      ) : (
        <>
          {renderSection(MENTIONS_LABELS.APPLICANTS, groupedData.applicants)}
          {renderSection(MENTIONS_LABELS.HIRING_REQUESTS, groupedData.requests)}
        </>
      )}
    </div>
  );
};

export default MentionPopup;
