export const formatMinutes = (minutes: number): string => {
  if (!minutes || minutes <= 0) return "";
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60);
    return `${seconds} sec`;
  }
  return Number.isInteger(minutes) ? `${minutes} min` : `${minutes} min`;
};
