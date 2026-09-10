import { useState } from "react";
import type { ReadMoreTextProps } from "./read-more-text.types";
import { READ_MORE_LENGTH } from "./rounds-side-panel.constants";

const ReadMoreText = ({ text, maxLength = READ_MORE_LENGTH }: ReadMoreTextProps) => {
  // justification: tracks expand/collapse toggle for truncated text
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = text.length > maxLength;

  if (!needsTruncation) return <>{text}</>;

  return (
    <>
      <div className={`truncated-wrap${expanded ? "" : " truncated-wrap--fade"}`}>
        {text}
      </div>
      <button className="show-more-btn" onClick={() => setExpanded((v) => !v)} type="button">
        {expanded ? <>Show less <i className="bx bx-chevron-up" /></> : <>Show more <i className="bx bx-chevron-down" /></>}
      </button>
    </>
  );
};

export default ReadMoreText;
