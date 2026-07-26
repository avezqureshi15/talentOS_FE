export interface UxState {
  at: number;
  ft: number;
  sb: boolean;
  sbh: boolean;
}

const UX_DEFAULTS: UxState = { at: 0, ft: 0, sb: true, sbh: false };

export const storage = {
  get(key: string): string | null {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set(key: string, value: string): void {
    try { localStorage.setItem(key, value); } catch { /* noop */ }
  },
  remove(key: string): void {
    try { localStorage.removeItem(key); } catch { /* noop */ }
  },
};

/* ── Unified UX object (_ux) ── */

function parseUx(raw: string | null): UxState {
  if (!raw) return { ...UX_DEFAULTS };
  try {
    const parsed = JSON.parse(raw);
    return {
      at: typeof parsed.at === "number" ? parsed.at : 0,
      ft: typeof parsed.ft === "number" ? parsed.ft : 0,
      sb: typeof parsed.sb === "boolean" ? parsed.sb : UX_DEFAULTS.sb,
      sbh: typeof parsed.sbh === "boolean" ? parsed.sbh : UX_DEFAULTS.sbh,
    };
  } catch {
    return { ...UX_DEFAULTS };
  }
}

export function getUx(key: string): UxState {
  return parseUx(storage.get(key));
}

export function patchUx(key: string, partial: Partial<UxState>): void {
  const current = getUx(key);
  const next = { ...current, ...partial };
  storage.set(key, JSON.stringify(next));
}

export function hasUxElapsed(key: string, field: "at" | "ft", ms: number): boolean {
  const ux = getUx(key);
  return !ux[field] || Date.now() - ux[field] > ms;
}
