const PanelSkeleton = () => (
  <div className="rp-content rp-skeleton">
    <span className="rp-skeleton-badge" />
    <div className="rp-divider" />
    <div className="rp-group">
      <span className="rp-group-title">Interview Info</span>
      <div className="rp-details">
        <div className="rp-row"><span className="rp-skeleton-line w-40" /></div>
        <div className="rp-row"><span className="rp-skeleton-line w-60" /></div>
        <div className="rp-row"><span className="rp-skeleton-line w-50" /></div>
        <div className="rp-row"><span className="rp-skeleton-line w-45" /></div>
      </div>
    </div>
    <div className="rp-divider" />
    <div className="rp-group">
      <span className="rp-group-title">Schedule Details</span>
      <div className="rp-details">
        <div className="rp-row"><span className="rp-skeleton-line w-35" /></div>
        <div className="rp-row"><span className="rp-skeleton-line w-55" /></div>
        <div className="rp-row"><span className="rp-skeleton-line w-30" /></div>
        <div className="rp-row"><span className="rp-skeleton-line w-50" /></div>
        <div className="rp-row"><span className="rp-skeleton-line w-40" /></div>
      </div>
    </div>
    <div className="rp-divider" />
    <div className="rp-group">
      <span className="rp-group-title">Decisions</span>
      <div className="rp-decision-cards">
        <div className="rp-decision-card"><span className="rp-skeleton-line w-30" /><span className="rp-skeleton-pill" /></div>
        <div className="rp-decision-card"><span className="rp-skeleton-line w-25" /><span className="rp-skeleton-pill" /></div>
        <div className="rp-decision-card"><span className="rp-skeleton-line w-20" /><span className="rp-skeleton-pill" /></div>
      </div>
    </div>
    <div className="rp-divider" />
    <div className="rp-group">
      <span className="rp-group-title">AI Summary</span>
      <div className="rp-ai-summary">
        <span className="rp-skeleton-line w-90" />
        <span className="rp-skeleton-line w-70" />
        <span className="rp-skeleton-line w-80" />
      </div>
    </div>
    <div className="rp-divider" />
    <div className="rp-group">
      <span className="rp-group-title">Ratings</span>
      <div className="rp-ratings">
        <div className="rp-rating-row"><span className="rp-skeleton-line w-40" /><span className="rp-skeleton-line w-15" /></div>
        <div className="rp-rating-row"><span className="rp-skeleton-line w-35" /><span className="rp-skeleton-line w-15" /></div>
        <div className="rp-rating-row"><span className="rp-skeleton-line w-45" /><span className="rp-skeleton-line w-15" /></div>
      </div>
    </div>
  </div>
);

export default PanelSkeleton;
