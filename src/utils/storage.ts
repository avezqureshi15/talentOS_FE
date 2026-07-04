export interface UxState {
  at: number;
  ft: number;
  sb: boolean;
  sbh: boolean;
}

const UX_DEFAULTS: UxState = { at: 0, ft: 0, sb: false, sbh: false };

export const storage = {
  get(key: string): string | null {
    return localStorage.getItem(key);
  },
  set(key: string, value: string): void {
    localStorage.setItem(key, value);
  },
  remove(key: string): void {
    localStorage.removeItem(key);
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
      sb: typeof parsed.sb === "boolean" ? parsed.sb : false,
      sbh: typeof parsed.sbh === "boolean" ? parsed.sbh : false,
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
