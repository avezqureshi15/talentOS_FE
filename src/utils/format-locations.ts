export function formatLocations(location: string[] | string | null | undefined): string {
  if (location == null) return "";
  if (typeof location === "string") return location;
  return location.filter(Boolean).join(", ");
}

export function isRemoteLocation(location: string[] | string | null | undefined): boolean {
  if (location == null) return false;
  const items = typeof location === "string" ? [location] : location;
  return items.some((item) => item.trim().toLowerCase() === "remote");
}
