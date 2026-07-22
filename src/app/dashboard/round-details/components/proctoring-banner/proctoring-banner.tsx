import "./proctoring-banner.css";

const ProctoringBanner = () => {
  return (
    <div className="pb-card">
      <div className="pb-icon"><i className="bx bx-shield" /></div>
      <div className="pb-content">
        <div className="pb-title">Proctoring Flags</div>
        <div className="pb-text">No proctoring flags surfaced during analysis. We still recommend reviewing the recording yourself before finalizing your decision.</div>
      </div>
    </div>
  );
};

export default ProctoringBanner;
