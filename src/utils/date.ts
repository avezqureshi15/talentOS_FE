export function toISTDisplay(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function parseTime(str: string): { h: number; m: number; isPM: boolean } | null {
  const m = str.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const isPM = m[3]?.toUpperCase() === "PM";
  if (isPM && h !== 12) h += 12;
  if (!isPM && h === 12) h = 0;
  return { h, m: min, isPM };
}

function formatTime(h: number, m: number): string {
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

export function toISTTimeRange(slotStr: string | null): string {
  if (!slotStr) return "";
  const parts = slotStr.split(/–|-/).map((s) => s.trim());
  if (parts.length !== 2) return slotStr;
  const start = parseTime(parts[0]);
  const end = parseTime(parts[1]);
  if (!start || !end) return slotStr;
  const addIST = (h: number, m: number) => {
    const total = h * 60 + m + 330;
    const nh = Math.floor(total / 60) % 24;
    const nm = total % 60;
    return { h: nh, m: nm };
  };
  const s = addIST(start.h, start.m);
  const e = addIST(end.h, end.m);
  return `${formatTime(s.h, s.m)} – ${formatTime(e.h, e.m)}`;
}
