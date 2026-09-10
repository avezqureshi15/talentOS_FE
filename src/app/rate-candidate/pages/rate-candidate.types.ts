export type ContextSection =
  | { type: "brand" }
  | { type: "divider" }
  | { type: "badge"; text: string }
  | { type: "title"; text: string }
  | { type: "meta"; items: { icon: string; text: string }[] }
  | { type: "note"; icon: string; heading: string; text: string };
