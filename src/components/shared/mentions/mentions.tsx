import "./mentions.css";
import { MENTIONS_LABELS } from "./mentions.constants";
import type { CommandItem, CommandEntry, WizardStage, Token, MenuController } from "./mentions.types";
import { resolveMenuSelection } from "./mentions.utils";
import MentionPopupHeader from "./mention-popup-header";
import MentionPopupList from "./mention-popup-list";

export type { MenuSelection } from "./mentions.utils";
export { resolveMenuSelection } from "./mentions.utils";

type MentionPopupProps = {
  show: boolean;
  onInsert: (text: string) => void;
  onWizardSelect?: (stage: WizardStage, item: CommandItem) => void;
  multiSelectedIds?: string[];
  onToggleMultiSelect?: (itemId: string) => void;
  menu: MenuController;
  wizardStage: WizardStage;
  tokens: Token[];
};

const MentionPopup = ({
  show, onInsert, onWizardSelect, multiSelectedIds, onToggleMultiSelect, menu, wizardStage, tokens,
}: MentionPopupProps) => {
  if (!show) return null;

  const {
    currentLevel, search, setSearch, filteredEntries, listItems,
    isListView, activeEntry, canGoBack, selectedIndex, setSelectedIndex,
    navigateTo, goBack, moveUp, moveDown, selectCurrentItem,
    loadMore, hasMore, isLoadingMore,
  } = menu;

  const multiIds = multiSelectedIds ?? [];
  const toggleMulti = onToggleMultiSelect ?? (() => {});
  const wizardActionId = tokens[0]?.id ?? "";
  const isMultiSelectStage = wizardStage > 0 && wizardActionId === "employees-ask-slots";
  const isSlotStage = wizardStage === 4;
  const isWizardActive = wizardStage > 0;

  const handleSelect = (current: CommandEntry | CommandItem) => {
    const result = resolveMenuSelection(current, isListView, activeEntry);
    switch (result.action) {
      case "wizard": {
        const entry = current as CommandEntry;
        onWizardSelect?.(result.stage, { id: entry.id, label: entry.label });
        break;
      }
      case "navigate":
        navigateTo(result.entry);
        break;
      default:
        if (isWizardActive && onWizardSelect && activeEntry) {
          onWizardSelect(wizardStage, current as CommandItem);
        } else {
          onInsert(result.text);
        }
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); moveDown(); break;
      case "ArrowUp": e.preventDefault(); moveUp(); break;
      case "Enter":
        if (!e.shiftKey) {
          e.preventDefault();
          const current = selectCurrentItem();
          if (current) handleSelect(current);
        }
        break;
    }
  };

  return (
    <div className="mention-popup">
      <MentionPopupHeader
        canGoBack={canGoBack}
        goBack={goBack}
        currentLevelTitle={currentLevel.title}
        isWizardActive={isWizardActive}
        wizardStage={wizardStage}
        tokens={tokens}
        multiLength={multiIds.length}
      />
      <div className="mp-search-wrapper">
        <i className="bx bx-search mp-search-icon" />
        <input
          className="mp-search"
          placeholder={isListView && activeEntry?.searchPlaceholder ? activeEntry.searchPlaceholder : MENTIONS_LABELS.SEARCH}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          autoFocus
        />
      </div>
      <MentionPopupList
        listItems={listItems}
        filteredEntries={filteredEntries}
        isListView={isListView}
        isSlotStage={isSlotStage}
        isMultiSelectStage={isMultiSelectStage}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        onSelect={handleSelect}
        hasMore={hasMore}
        loadMore={loadMore}
        isLoadingMore={isLoadingMore}
        multiSelectedIds={multiIds}
        onToggleMultiSelect={toggleMulti}
      />
    </div>
  );
};

export default MentionPopup;
