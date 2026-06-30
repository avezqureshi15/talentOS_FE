import { useState } from "react";
import AccordionCard from "@/components/shared/accordion-card/accordion-card";
import BaseModal from "@/components/ui/modal/base-modal";
import { MOCK_REVIEWERS, REVIEWS_LABELS, REVIEW_INFO } from "./reviews-card.constants";
import type { InterviewDetails, SidePanelContentProps } from "./reviews-card.types";
import "./reviews.css";

const Reviews = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [panelInterview, setPanelInterview] = useState<InterviewDetails | null>(null);

  if (MOCK_REVIEWERS.length === 0) {
    return <div className="hr-tab-placeholder">{REVIEWS_LABELS.NO_REVIEWS}</div>;
  }

  return (
    <>
      <div className="accordion-list">
        {MOCK_REVIEWERS.map((r) => (
          <AccordionCard
            key={r.id}
            id={r.id}
            name={r.name}
            email={r.email}
            contactNumber={r.contactNumber}
            linkHref={r.reviewLink}
            linkLabel={REVIEWS_LABELS.REVIEW_LINK}
            isOpen={openId === r.id}
            onToggleOpen={(id) => setOpenId(openId === id ? null : id)}
            interviewLabel={REVIEWS_LABELS.INTERVIEW}
            onViewInterview={() => setPanelInterview(r.interview)}
          />
        ))}
      </div>

      <BaseModal
        open={!!panelInterview}
        onClose={() => setPanelInterview(null)}
        title={REVIEWS_LABELS.SIDE_PANEL_TITLE}
        variant="slide-right"
      >
        {panelInterview && <SidePanelContent interview={panelInterview} />}
      </BaseModal>
    </>
  );
};

const SidePanelContent = ({ interview }: SidePanelContentProps) => {
  return (
    <div className="sp-content">
      <span className="sp-badge">{interview.round}</span>

      <div className="sp-divider" />

      <div className="sp-details">
        {REVIEW_INFO.map((row) => {
          const value = interview[row.key];
          return (
            <div key={row.key} className="sp-detail-item">
              <span className="sp-detail-label">{row.label}</span>
              <span className="sp-detail-value">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reviews;
