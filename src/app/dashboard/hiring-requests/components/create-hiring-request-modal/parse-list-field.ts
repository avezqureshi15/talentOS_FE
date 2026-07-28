/** Split a multiline text field into trimmed non-empty items. */
export function parseListField(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
