import { APPLICANT_LABELS } from "@/constants/constants";
import type { Applicant } from "./applicants.types";

type Props = {
  applicant: Applicant;
  onDetailsReadMore?: (id: string) => void;
  showAll?: boolean;
};

type DetailItem = {
  key: string;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  suffix?: string;
};

const FACT_ROWS: { key: keyof Applicant; label: string; suffix?: string }[] = [
  { key: "location", label: APPLICANT_LABELS.LOCATION },
  { key: "currentCtc", label: APPLICANT_LABELS.CURRENT_CTC, suffix: " LPA" },
  { key: "expectedCtc", label: APPLICANT_LABELS.EXPECTED_CTC, suffix: " LPA" },
  { key: "yearsOfExperience", label: APPLICANT_LABELS.YEARS_OF_EXPERIENCE, suffix: " yrs" },
  { key: "noticePeriod", label: APPLICANT_LABELS.NOTICE_PERIOD, suffix: " days" },
  { key: "howDidYouHear", label: APPLICANT_LABELS.HOW_DID_YOU_HEAR },
  { key: "willingToRelocate", label: APPLICANT_LABELS.WILLING_TO_RELOCATE },
];

const FACT_VALUE_MAP = (a: Applicant): Record<string, string | undefined> => ({
  currentCtc: a.currentCtc,
  expectedCtc: a.expectedCtc,
  location: a.location,
  yearsOfExperience: a.yearsOfExperience,
  noticePeriod: a.noticePeriod,
  howDidYouHear: a.howDidYouHear,
  willingToRelocate:
    a.willingToRelocate === true ? "Yes" : a.willingToRelocate === false ? "No" : undefined,
});

function formatDetailValue(value: string, suffix?: string): string {
  if (value.toLowerCase() === "immediate") return "Immediate";
  return `${value}${suffix ?? ""}`;
}

function buildDetailItems(a: Applicant): DetailItem[] {
  const items: DetailItem[] = [];
  if (a.phone) {
    items.push({ key: "phone", label: APPLICANT_LABELS.PHONE_NUMBER, value: a.phone, href: `tel:${a.phone}` });
  }
  if (a.cvUrl) {
    items.push({
      key: "cv",
      label: APPLICANT_LABELS.CV,
      value: APPLICANT_LABELS.OPEN_CV,
      href: a.cvUrl,
      external: true,
    });
  }
  if (a.linkedinUrl) {
    items.push({
      key: "linkedin",
      label: APPLICANT_LABELS.LINKEDIN,
      value: APPLICANT_LABELS.VIEW_PROFILE,
      href: a.linkedinUrl,
      external: true,
    });
  }

  const facts = FACT_VALUE_MAP(a);
  for (const row of FACT_ROWS) {
    const value = facts[row.key];
    if (!value) continue;
    items.push({
      key: String(row.key),
      label: row.label,
      value: formatDetailValue(value, row.suffix),
    });
  }
  return items;
}

const CardDetailsTab = ({ applicant: a, onDetailsReadMore, showAll = false }: Props) => {
  const filled = buildDetailItems(a);
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
          {visible.map((row) => (
            <div className="details-row" key={row.key}>
              <span className="details-label">{row.label}</span>
              {row.href ? (
                <a
                  className="details-value details-value--link"
                  href={row.href}
                  target={row.external ? "_blank" : undefined}
                  rel={row.external ? "noreferrer" : undefined}
                  onClick={(e) => e.stopPropagation()}
                >
                  {row.value}
                </a>
              ) : (
                <span className="details-value">{row.value}</span>
              )}
            </div>
          ))}
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
