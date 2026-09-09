import { APPLICANT_LABELS } from "@/constants/constants";
import type { Applicant } from "./applicants.types";

type Props = {
  applicant: Applicant;
  onDetailsReadMore?: (id: string) => void;
  isRemote: boolean;
  showAll?: boolean;
};

const DETAILS_ROWS: { key: keyof Applicant; label: string; suffix?: string; }[] = [
  { key: "currentCtc", label: APPLICANT_LABELS.CURRENT_CTC, suffix: " LPA" },
  { key: "expectedCtc", label: APPLICANT_LABELS.EXPECTED_CTC, suffix: " LPA" },
  { key: "location", label: APPLICANT_LABELS.LOCATION },
  { key: "yearsOfExperience", label: APPLICANT_LABELS.YEARS_OF_EXPERIENCE, suffix: " yrs" },
  { key: "noticePeriod", label: APPLICANT_LABELS.NOTICE_PERIOD, suffix: " days" },
  { key: "howDidYouHear", label: APPLICANT_LABELS.HOW_DID_YOU_HEAR },
  { key: "willingToRelocate", label: APPLICANT_LABELS.WILLING_TO_RELOCATE },
];

const DETAIL_VALUE_MAP = (a: Applicant, isRemote: boolean): Record<string, string | undefined> => ({
  currentCtc: a.currentCtc,
  expectedCtc: a.expectedCtc,
  location: a.location,
  yearsOfExperience: a.yearsOfExperience,
  noticePeriod: a.noticePeriod,
  howDidYouHear: a.howDidYouHear,
  willingToRelocate: isRemote
    ? APPLICANT_LABELS.JOB_IS_REMOTE
    : a.willingToRelocate === true
    ? "Yes"
    : a.willingToRelocate === false
      ? "No"
      : undefined,
});

function formatDetailValue(value: string, suffix?: string): string {
  if (value.toLowerCase() === "immediate") return "Immediate";
  return `${value}${suffix ?? ""}`;
}

const CardDetailsTab = ({ applicant: a, onDetailsReadMore, isRemote, showAll = false }: Props) => {
  const map = DETAIL_VALUE_MAP(a, isRemote);
  const filled = DETAILS_ROWS.filter((row) => !!map[row.key]);
  const visible = showAll ? filled : filled.slice(0, 2);
  const hasMore = !showAll && filled.length > 2;

  return (
    <div className={`cover-letter${showAll ? " cep-details" : ""}`}>
      {!showAll && (
        <div className="cover-letter-label">
          <i className="bx bx-detail" />
          {APPLICANT_LABELS.DETAILS}
        </div>
      )}
      {visible.length > 0 ? (
        <div className="details-grid">
          {visible.map((row) => {
            const value = map[row.key];
            if (!value) return null;
            return (
              <div className="details-row" key={row.key}>
                <span className="details-label">{row.label}</span>
                <span className={`details-value${value === APPLICANT_LABELS.JOB_IS_REMOTE ? " details-value--remote" : ""}`}>
                  {formatDetailValue(value, row.suffix)}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="cover-letter-text">{APPLICANT_LABELS.NO_DETAILS}</p>
      )}
      {hasMore && onDetailsReadMore && (
        <button className="read-more" onClick={(e) => { e.stopPropagation(); onDetailsReadMore(a.id); }}>
          {APPLICANT_LABELS.VIEW_ALL_DETAILS} →
        </button>
      )}
    </div>
  );
};

export default CardDetailsTab;
