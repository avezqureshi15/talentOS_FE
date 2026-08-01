# Theme Rules — talentOS_FE

Every component MUST follow these rules. Theming is **100% token-driven**. There is **zero** hardcoded color usage outside `src/index.css`.

## 1. Architecture (how theming works)

- `src/index.css` is the **single source of truth** for all colors.
  - `:root` (top of file) = **dark theme defaults**.
  - `[data-theme="light"]` block (line ~316) = **light theme overrides**.
- The theme store (`src/store/theme.store.ts`) controls which block is active:
  - `theme: "system" | "dark" | "light"` — persisted in `localStorage` under key `talentos_theme` (`STORAGE_KEYS.THEME`).
  - `setTheme(mode)` — the ONLY way to change the theme.
  - `system` resolves via `window.matchMedia("(prefers-color-scheme: dark)")` and **live-updates** when the OS theme changes (built-in matchMedia listener — do not add another one).
  - Light mode = `data-theme="light"` attribute set on `<html>`. **Dark mode = attribute removed** (never `data-theme="dark"`).
- Components never read/write localStorage, never touch `document.documentElement`, never call `applyTheme` directly. **Only** `useThemeStore` → `s.theme` / `s.setTheme` / `s.resolvedTheme`.

## 2. Hard rules (non-negotiable)

1. **No hex, rgb, rgba, hsl, color-mix colors in any CSS file except `index.css`.** Not in components, not inline `style={{ color: "#fff" }}` — nothing.
2. **No fallback colors inside `var()`** — `var(--text-primary, #ffffff)` is banned. Either the token exists or it doesn't.
3. **Do not override tokens in component CSS.** Tokens are only defined in `index.css` (dark + light block).
4. **Do not duplicate or redefine the `data-theme` mechanics.** Component CSS may only contain `[data-theme="light"] ...` *overrides* when a component genuinely needs different behavior per theme (e.g., killing a backdrop blur) — never to re-color things.
5. **Light mode is flat — no glassmorphism.** Glass tokens are defined to be **opaque** in the light block. Do not introduce translucent surfaces, `backdrop-filter` blur on surfaces, or `rgba` backgrounds in light mode. Colored tints (pills/badges) and scrims (`--overlay*`) are exempt.
6. **Dark mode keeps glassmorphism.** Glass tokens there are translucent by design — leave them alone.
7. **Never add a new theme** ("sepia", "oled", ...). The store supports exactly `system | dark | light`.

## 3. Token cheat sheet (use these)

### Surfaces (cards, panels, chips, inputs)
| Token | Dark (glass) | Light (opaque) |
|---|---|---|
| `--surface-glass` | translucent white | `#f7f7f9` |
| `--surface-glass-hover` | translucent white | `#eef0f2` |
| `--surface-elevated` | translucent white | `#fafafa` |
| `--surface-card` / `--surface-card-hover` | translucent white | `#f7f7f9` / `#efeff1` |
| `--surface-disabled` | translucent white | `#f1f1f2` |
| `--surface-mist` | translucent white | `#ffffff` |
| `--chip-bg` / `--chip-hover` | translucent white | `#ececee` / `#e4e4e7` |
| `--sheet-bg` | dark glass (drawers/sheets/toasts) | `#ffffff` |
| `--bg-primary` / `--bg-secondary` / `--bg-tertiary` | dark neutrals | white / `#f6f6f6` / `#e8e8ea` |
| `--bg-hover` / `--bg-active` | hover/active fills | same pattern |

### Text
- `--text-primary` / `--text-secondary` / `--text-muted` / `--text-faint` — always use the lightest that stays readable.
- `--text-white` is **inverted per theme** (black in light mode, white in dark). Use it only for "text on colored/accent surfaces".
- `--static-white` is always white (`#ffffff`) — for elements that must stay white in both themes (e.g., toggle thumbs, text on accent buttons).

### Borders & shadows
- `--border-subtle` / `--border-default` / `--border-strong` — never raw `1px solid #ddd`.
- Shadows: `--shadow-sm/md/lg/xl` for elevation; `--shadow-color-*` (strong/mid/light/faint/...) when composing custom shadows.

### Colored tints (status, chips, badges) — ALWAYS token pairs
Use the family tokens, never raw colors:
- `--success-bg` / `--success-bg-strong` / `--success-light` (text)
- `--danger-bg` / `--danger-bg-strong` / `--danger` (text)
- `--warning-bg` / `--warning-bg-strong` / `--warning-light` (text)
- `--info-bg` / `--info-light`, `--neutral-bg` / `--neutral-light`, `--primary-bg` / `--primary-light`
- `--yellow-bg` / `--yellow`, `--accent-bg`, `--accent-indigo-bg`, `--accent-blue-bg`
- Status pills: `--status-pill-success-*`, `--status-pill-warning-*`, `--status-pill-danger-*`
- Borders for tints: `--success-border`, `--warning-border`, `--danger-border`, etc.

> In light mode these are **opaque pastels** (e.g. `--success-bg: #dcfce7`) with **dark text** tokens (e.g. `--success-light: #059669`). Never hardcode `#dcfce7` — use the token; the theme swaps both together.

### Glass overlays (video player chrome etc.)
`--glass-weak/soft/mid/strong/stronger/xstrong` are **dark in light mode** (so controls stay visible) and white-glass in dark. Text on them: `--glass-bright` / `--glass-faint` (stay white-based — correct in both modes).

### Scrims & overlays (allowed translucent in BOTH themes)
`--overlay`, `--overlay-subtle`, `--overlay-faint` — modal/popover backdrops. Backdrop blur on scrims is fine.

### Buttons & accents
- Primary: `--button-primary-bg` / `--button-primary-text` / `--button-primary-hover`
- CTA: `--cta-bg` / `--cta-border` / `--cta-hover` / `--cta-border-hover`
- Send button: `--send-btn-bg` / `--send-btn-color` / `--send-btn-glow*`
- Accents: `--accent`, `--accent-hover`, `--accent-glow`, `--accent-blue`, `--accent-violet`, `--accent-indigo*`
- Semantic: `--danger`, `--danger-400`, `--success`, `--warning`, `--verdict-*`, `--cancelled*`

## 4. Adding a new token (do it in BOTH blocks)

If a needed color doesn't exist:

1. Add the token to the dark `:root` block **and** to the `[data-theme="light"]` block.
2. Name it semantically (`--<context>-bg`, `--<context>-text`, `--<context>-border`), not by color name (`--blue` is wrong).
3. Light value must be **opaque** unless it's a scrim/glow/tint exception.
4. Update the token tables in this doc.

## 5. Component CSS conventions

- Each component imports its own CSS file (`import "./component.css"`), prefixed classes (`.settings-segment`, `.sr-*`, `.combobox-*`).
- Default (unprefixed) rule = **both themes** via tokens. Add `[data-theme="light"]` overrides only for behavior changes (e.g. `backdrop-filter: none`).
- Borders on light surfaces keep them visible: `border: 1px solid var(--border-default)`.
- `backdrop-filter` on surfaces = dark-mode-only feature. If you add blur, also add a `[data-theme="light"]` rule disabling it and making the background opaque.

## 6. Theme settings UI (if you touch it)

- Lives in `settings-modal.tsx` (profile popover → Settings → Theme).
- Uses the **segmented control** (`.settings-segment`), NOT a select/dropdown.
- Options are `{ value: "light" | "dark" | "system", label, icon }` with Boxicons: `bx-sun`, `bx-moon`, `bx-desktop`.
- Clicking calls `setTheme(value)`. Do not add toggles, radio rows, or extra theme options.

## 7. Verification (run before committing any styled change)

From `talentOS_FE/`:

```powershell
# 1. No bare hex/rgb/rgba/hsl colors outside index.css  (expect 0)
Get-ChildItem src -Recurse -Filter *.css | Where-Object { $_.FullName -notlike '*index.css' } |
  Select-String -Pattern '#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(' | Measure-Object | Select-Object Count

# 2. color-mix() allowed ONLY with tokens/transparent inside — no literal hex  (expect 0)
Get-ChildItem src -Recurse -Filter *.css | Where-Object { $_.FullName -notlike '*index.css' } |
  Select-String -Pattern 'color-mix\([^)]*#[0-9a-fA-F]{3,8}' | Measure-Object | Select-Object Count

# 3. No var() fallback colors  (expect 0)
Get-ChildItem src -Recurse -Filter *.css |
  Select-String -Pattern 'var\([^)]*,\s*#|var\([^)]*,\s*rgba?\(' | Measure-Object | Select-Object Count

# 4. Light block must contain no translucent background tokens
# (see the `-bg` / `-bg-strong` / `-bg-soft` tokens inside [data-theme="light"])

# 5. Types
npx tsc -b
```

Sweeps 1–3 must return **zero**. If any fail, fix it — do not merge.
