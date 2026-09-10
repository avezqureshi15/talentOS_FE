import { APPLICANT_LABELS } from "@/constants/constants";
import type { Applicant, CardVariant } from "./applicants.types";

type Props = {
  applicant: Applicant;
  onDetailsReadMore?: (id: string) => void;
  showAll?: boolean;
  variant?: CardVariant;
};

type DetailKind = "text" | "link" | "cv" | "tag" | "pill";

type DetailItem = {
  key: string;
  label: string;
  value?: string;
  href?: string;
  external?: boolean;
  suffix?: string;
  kind?: DetailKind;
  tone?: "success" | "neutral";
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

function formatFact(value?: string, suffix?: string): string | undefined {
  if (!value) return undefined;
  return formatDetailValue(value, suffix);
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

function buildPanelItems(a: Applicant): DetailItem[] {
  return [
    {
      key: "phone",
      label: APPLICANT_LABELS.PHONE_NUMBER,
      value: a.phone,
      href: a.phone ? `tel:${a.phone}` : undefined,
      kind: "link",
    },
    {
      key: "cv",
      label: APPLICANT_LABELS.CV,
      value: a.cvUrl ? APPLICANT_LABELS.VIEW_RESUME : undefined,
      href: a.cvUrl,
      kind: "cv",
    },
    {
      key: "linkedin",
      label: APPLICANT_LABELS.LINKEDIN,
      value: a.linkedinUrl ? APPLICANT_LABELS.VIEW_PROFILE : undefined,
      href: a.linkedinUrl,
      kind: "link",
    },
    { key: "howDidYouHear", label: APPLICANT_LABELS.SOURCE, value: a.howDidYouHear, kind: "tag" },
    { key: "location", label: APPLICANT_LABELS.LOCATION, value: a.location },
    {
      key: "currentCtc",
      label: APPLICANT_LABELS.CURRENT_CTC,
      value: formatFact(a.currentCtc, " LPA"),
    },
    {
      key: "expectedCtc",
      label: APPLICANT_LABELS.EXPECTED_CTC,
      value: formatFact(a.expectedCtc, " LPA"),
    },
    {
      key: "yearsOfExperience",
      label: APPLICANT_LABELS.YEARS_OF_EXPERIENCE,
      value: formatFact(a.yearsOfExperience, " yrs"),
    },
    {
      key: "noticePeriod",
      label: APPLICANT_LABELS.NOTICE_PERIOD,
      value: formatFact(a.noticePeriod, " days"),
    },
    {
      key: "willingToRelocate",
      label: APPLICANT_LABELS.WILLING_TO_RELOCATE,
      value:
        a.willingToRelocate === true
          ? "Yes"
          : a.willingToRelocate === false
            ? "No"
            : undefined,
      kind: "pill",
      tone: a.willingToRelocate ? "success" : "neutral",
    },
  ];
}

function renderPanelValue(item: DetailItem) {
  if (!item.value) {
    return <span className="cep-field-empty">{APPLICANT_LABELS.NOT_PROVIDED}</span>;
  }
  switch (item.kind) {
    case "cv":
      return (
        <a
          className="cep-badge cep-badge--cv"
          href={item.href}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <i className="bx bx-file" aria-hidden />
          {item.value}
        </a>
      );
    case "link": {
      const isTel = item.href?.startsWith("tel:");
      return (
        <a
          className="cep-badge cep-badge--link"
          href={item.href}
          target={isTel ? undefined : "_blank"}
          rel={isTel ? undefined : "noreferrer"}
          onClick={(e) => e.stopPropagation()}
        >
          <i className={`bx ${isTel ? "bx-phone" : "bx-link-external"}`} aria-hidden />
          {item.value}
        </a>
      );
    }
    case "tag":
      return <span className="cep-tag">{item.value}</span>;
    case "pill":
      return <span className={`cep-pill cep-pill--${item.tone ?? "neutral"}`}>{item.value}</span>;
    default:
      return <span className="cep-field-value">{item.value}</span>;
  }
}

const CardDetailsTab = ({ applicant: a, onDetailsReadMore, showAll = false, variant = "inline" }: Props) => {
  const isPanel = variant === "panel" || showAll;

  if (isPanel) {
    const panelItems = buildPanelItems(a);
    return (
      <div className="cover-letter cep-details">
        <div className="cep-details-grid">
          {panelItems.map((item) => (
            <div className="cep-field" key={item.key}>
              <span className="cep-field-label">{item.label}</span>
              {renderPanelValue(item)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const filled = buildDetailItems(a);
  const visible = filled.slice(0, 2);
  const hasMore = filled.length > 2;

  return (
    <div className="cover-letter">
      <div className="cover-letter-label">
        <i className="bx bx-detail" />
        {APPLICANT_LABELS.DETAILS}
      </div>
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
