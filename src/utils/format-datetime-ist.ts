const IST_TIME_ZONE = "Asia/Kolkata";

const IST_DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  timeZone: IST_TIME_ZONE,
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
};

/** Format an ISO / parseable date string in India Standard Time. */
export function formatDateTimeIST(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-IN", IST_DATE_TIME_OPTIONS);
}
