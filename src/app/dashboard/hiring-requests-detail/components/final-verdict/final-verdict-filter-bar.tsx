import StatusToggleBar from "@/app/dashboard/hiring-requests-detail/components/detail/status-toggle-bar";
import { FINAL_VERDICT_SUB_TABS } from "./final-verdict.constants";
import type { FinalVerdictSubTab } from "./final-verdict.types";

type Props = {
  value: FinalVerdictSubTab;
  onChange: (value: FinalVerdictSubTab) => void;
  counts: Record<FinalVerdictSubTab, number>;
};

const FinalVerdictFilterBar = ({ value, onChange, counts }: Props) => (
  <StatusToggleBar
    value={value}
    onChange={onChange}
    options={FINAL_VERDICT_SUB_TABS.map((tab) => ({
      value: tab.key,
      label: tab.label,
      count: counts[tab.key],
    }))}
  />
);

export default FinalVerdictFilterBar;
