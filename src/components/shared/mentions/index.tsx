import React from "react";
import type { MentionPopupProps } from "@/components/shared/mentions/mentions.types";
import "./mentions.css";

const MentionPopup: React.FC<MentionPopupProps> = ({
  show,
  data,
  activeTrigger,
  onSelect,
}) => {
  if (!show || !activeTrigger) return null;

  // 🔹 group data
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
        <div className="mention-empty">No results found</div>
      ) : (
        <>
          {renderSection("Applicants", groupedData.applicants)}
          {renderSection("Hiring Requests", groupedData.requests)}
        </>
      )}
    </div>
  );
};

export default MentionPopup;