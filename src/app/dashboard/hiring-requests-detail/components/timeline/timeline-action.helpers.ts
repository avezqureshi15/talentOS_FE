const JOIN_MEETING_LABELS = new Set(["join meeting", "join meet"]);

/** HR History should not present meet URLs as a Join CTA. */
export function isJoinMeetingAction(label: string | null | undefined): boolean {
  if (!label) return false;
  return JOIN_MEETING_LABELS.has(label.trim().toLowerCase());
}

/** Short display host/path for meet URLs in History meta rows. */
export function formatMeetLinkLabel(url: string): string {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.length > 1 ? parsed.pathname : "";
    const label = `${parsed.host}${path}`;
    return label.length > 42 ? `${label.slice(0, 39)}…` : label;
  } catch {
    return url.length > 42 ? `${url.slice(0, 39)}…` : url;
  }
}
