import "./round-details.css";
import { MOCK_EVALUATION } from "./round-details.constants";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import HeroScoreCard from "../components/hero-score-card/hero-score-card";
import EvaluationTopics from "../components/evaluation-topics/evaluation-topics";
import ProctoringBanner from "../components/proctoring-banner/proctoring-banner";
import ActionBar from "../components/action-bar/action-bar";
import MediaPlayer from "../components/media-player/media-player";
import TranscriptPanel from "../components/transcript-panel/transcript-panel";

const getInitials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const RoundDetails = () => {
  const data = MOCK_EVALUATION;

  return (
    <>
      <PageHeader
        title={data.email}
        avatarLabel={getInitials(data.candidateName)}
        meta={[
          { label: data.status, variant: "success" },
          { label: "21 Jul, 15:57 IST" },
          { label: data.jobTitle },
          { label: data.appliedDate },
        ]}
        actions={[
          { key: "resume", label: "Resume", icon: "bx bx-file-text", onClick: () => {} },
          { key: "share", label: "Share", icon: "bx bx-share-alt", onClick: () => {} },
        ]}
      />
      <div className="rd-page">
        <div className="rd-split">
          <div className="rd-left">
            <HeroScoreCard
              aiRecommendation={data.aiRecommendation}
              overallScore={data.overallScore}
              criteriaMet={data.criteriaMet}
              totalCriteria={data.totalCriteria}
              aiSummary={data.aiSummary}
            />

            <EvaluationTopics topics={data.topics} />

            <ProctoringBanner />

            <ActionBar />
          </div>

          <div className="rd-right">
            <div className="rd-video-container">
              <MediaPlayer />
            </div>
            <div className="rd-transcript-container">
              <TranscriptPanel sections={data.transcriptSections} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoundDetails;
