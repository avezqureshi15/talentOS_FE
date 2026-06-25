export const truncateText = (text: string, limit: number) => {
  const words = text.split(/\s+/);
  if (words.length <= limit) return { text, truncated: false };
  return { text: words.slice(0, limit).join(" ") + "...", truncated: true };
};

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
