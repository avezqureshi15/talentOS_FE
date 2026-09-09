import { useState } from "react";
import { useApplicantState } from "@/app/dashboard/hiring-requests-detail/components/applicants/hooks/use-applicant-state";
import CardExpandedContent from "@/app/dashboard/hiring-requests-detail/components/applicants/card-expanded-content";
import CoverLetterModal from "@/app/dashboard/hiring-requests-detail/components/modal/cover-letter-modal";
import type { AccordionTab, Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import "./candidate-expanded-panel.css";

type CandidateExpandedPanelProps = {
  applicant: Applicant;
  jdId?: string;
  isRemote?: boolean;
  isScreening?: boolean;
  onTimeline?: (candidateId: number) => void;
};

const CandidateExpandedPanel = ({
  applicant,
  jdId,
  isRemote = false,
  isScreening = false,
  onTimeline,
}: CandidateExpandedPanelProps) => {
  const [accordionTab, setAccordionTab] = useState<AccordionTab>("details");
  const [coverLetterOpen, setCoverLetterOpen] = useState(false);
  const stateConfig = useApplicantState(applicant, isScreening);
  const currentRoundHref =
    applicant.currentRoundId && jdId
      ? `/hiring-requests/${jdId}/round-details/${applicant.currentRoundId}?candidateId=${applicant.candidateId}`
      : undefined;

  return (
    <div className="cep">
      <CardExpandedContent
        applicant={applicant}
        stateConfig={stateConfig}
        accordionTab={accordionTab}
        onTabChange={setAccordionTab}
        onTimeline={(id) => onTimeline?.(id)}
        onCoverLetterReadMore={() => setCoverLetterOpen(true)}
        jdId={jdId}
        isRemote={isRemote}
        showAllDetails
        currentRoundHref={currentRoundHref}
      />
      <CoverLetterModal
        open={coverLetterOpen}
        applicantName={applicant.name}
        coverLetter={applicant.coverLetter ?? ""}
        onClose={() => setCoverLetterOpen(false)}
      />
    </div>
  );
};

export default CandidateExpandedPanel;
