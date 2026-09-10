export default function EmailPreviewSkeleton() {
  return (
    <div className="em-preview-skeleton" aria-label="Loading email preview">
      <div className="eps-acc" />
      <div className="eps-block">
        <div className="eps-line eps-line--short" />
        <div className="eps-line" />
        <div className="eps-line" />
        <div className="eps-line eps-line--long" />
        <div className="eps-line" />
      </div>
      <div className="eps-cta" />
      <div className="eps-block">
        <div className="eps-line" />
        <div className="eps-line eps-line--short" />
      </div>
      <div className="eps-footer" />
    </div>
  );
}
