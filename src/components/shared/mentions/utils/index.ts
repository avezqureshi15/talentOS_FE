import type { CommandItem, CommandEntry, WizardStage, Token, MenuSelection } from "../types";
import { WIZARD_ACTIONS } from "../config/wizard.config";
import { ICON_RULES, WIZARD_LABELS, SLOT_GROUP_ORDER, SLOT_FALLBACK_GROUP } from "../constants";

export type { MenuSelection };

export function resolveMenuSelection(
  current: CommandEntry | CommandItem,
  isListView: boolean,
  activeEntry: CommandEntry | null,
): MenuSelection {
  if (isListView) {
    const item = current as CommandItem;
    return { action: "insert", text: activeEntry?.getInsertText?.(item) ?? item.label };
  }
  const entry = current as CommandEntry;
  if (entry.isWizardAction) {
    return { action: "wizard", stage: 0 as WizardStage };
  }
  if (entry.children || entry.fetcher) {
    return { action: "navigate", entry };
  }
  return { action: "insert", text: entry.getInsertText?.() ?? entry.label };
}

export function getDefaultIcon(id: string): string {
  return ICON_RULES.find((rule) => rule.match(id))?.icon ?? "";
}

export function getStageHeader(stage: WizardStage, tokens: Token[]): string {
  const actionId = tokens[0]?.id;
  const action = actionId ? WIZARD_ACTIONS[actionId] : null;
  return action?.stages[stage - 1]?.header ?? WIZARD_LABELS.STAGE_0_HEADER;
}

export function groupSlots(items: CommandItem[]): { group: string; items: CommandItem[] }[] {
  const map = new Map<string, CommandItem[]>();
  for (const item of items) {
    const group = item.description ?? SLOT_FALLBACK_GROUP;
    if (!map.has(group)) map.set(group, []);
    map.get(group)!.push(item);
  }
  const sortKey = (g: string) => { const i = SLOT_GROUP_ORDER.indexOf(g); return i === -1 ? 99 : i; };
  return [...map.entries()].sort(([a], [b]) => sortKey(a) - sortKey(b)).map(([group, items]) => ({ group, items }));
}
