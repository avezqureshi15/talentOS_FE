type LastRoundLinkProps = {
  roundId: string;
  label: string;
  onViewRound: (roundId: string) => void;
};

const LastRoundLink = ({ roundId, label, onViewRound }: LastRoundLinkProps) => (
  <button
    type="button"
    className="round-link-btn"
    onClick={(e) => {
      e.stopPropagation();
      onViewRound(roundId);
    }}
  >
    {label}
    <i className="bx bx-chevron-right" aria-hidden />
  </button>
);

export default LastRoundLink;
