export const CALL_WINDOW_DEFAULT_FROM = "09:00";
export const CALL_WINDOW_DEFAULT_TO = "18:00";
export const CALL_WINDOW_DEFAULT_TIMEZONE = "Asia/Kolkata";

export const CALL_WINDOW_TIMEZONE_OPTIONS = [
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Hong_Kong",
  "Asia/Seoul",
  "Australia/Sydney",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Africa/Lagos",
  "Africa/Johannesburg",
  "UTC",
].map((tz) => ({ value: tz, label: tz }));
