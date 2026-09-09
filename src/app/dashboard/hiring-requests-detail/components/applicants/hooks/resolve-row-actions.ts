import type { ActionConfig, MenuAction, StateConfig } from "../applicants.types";

export type TableRowActions = {
  primary: ActionConfig | null;
  secondary: ActionConfig | null;
  tertiary: ActionConfig | null;
  overflowActions: ActionConfig[];
  menuActions: MenuAction[];
};

export function resolveTableRowActions(
  config: StateConfig,
  opts: { hideCallNow?: boolean } = {},
): TableRowActions {
  const actions = config.actions.filter(
    (action) => !(opts.hideCallNow && action.handler === "onCallNow"),
  );
  const primary = actions[0] ?? null;
  const secondary = actions[1] ?? null;
  const tertiary = actions[2] ?? null;
  const overflowActions = actions.slice(3);
  const rejectOnRow = [primary, secondary, tertiary].some(
    (action) => action?.variant === "reject" || action?.handler === "onRejectFromEvaluation",
  );
  const menuActions: MenuAction[] = [];
  for (const action of config.menuActions) {
    if (action === "reject" && rejectOnRow) continue;
    if (!menuActions.includes(action)) menuActions.push(action);
  }
  if (!menuActions.includes("archive")) menuActions.push("archive");
  return { primary, secondary, tertiary, overflowActions, menuActions };
}
