import SearchInput from "@/components/ui/search-input/search-input";

type MentionPopupSearchProps = {
  search: string;
  onSearch: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  showSidebar: boolean;
  onToggleSidebar: () => void;
};

const MentionPopupSearch = ({ search, onSearch, onKeyDown, placeholder, showSidebar, onToggleSidebar }: MentionPopupSearchProps) => (
  <div className="mp-search-wrapper">
    <SearchInput
      variant="ghost"
      placeholder={placeholder}
      value={search}
      onChange={onSearch}
      onKeyDown={onKeyDown}
      autoFocus
    />
    {showSidebar && (
      <button
        type="button"
        className="st-toggle"
        onClick={onToggleSidebar}
        aria-label="Select slot view"
        title="Filter by interviewer"
      >
        <i className="bx bx-menu" />
      </button>
    )}
  </div>
);

export default MentionPopupSearch;
