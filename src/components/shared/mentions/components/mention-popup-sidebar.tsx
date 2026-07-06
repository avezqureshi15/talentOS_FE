import { COMMON_SLOTS_TAB_ID, COMMON_SLOTS_TAB_LABEL } from "./slot-tabs/slot-tabs.constants";

type MentionPopupSidebarProps = {
  mounted: boolean;
  closing: boolean;
  activeTab: string;
  interviewerTokens: { id: string; name: string }[];
  activeInterviewerName: string | null;
  onSelect: (tabId: string) => void;
  onClose: () => void;
};

const MentionPopupSidebar = ({ mounted, closing, activeTab, interviewerTokens, activeInterviewerName, onSelect, onClose }: MentionPopupSidebarProps) => {
  if (!mounted) return null;

  return (
    <>
      <div className={`st-backdrop${closing ? " st-backdrop--closing" : ""}`} onClick={onClose} />
      <aside className={`st-sidebar${closing ? " st-sidebar--closing" : ""}`}>
        <div className="st-sidebar-head">
          <span>Slot View</span>
          <button type="button" className="st-sidebar-close" onClick={onClose}>
            <i className="bx bx-x" />
          </button>
        </div>
        <div className="st-sidebar-body">
          <div className="st-section-label">Interviewers</div>
          <button
            type="button"
            className={`st-sidebar-item${activeTab === COMMON_SLOTS_TAB_ID ? " st-sidebar-item--active" : ""}`}
            onClick={() => onSelect(COMMON_SLOTS_TAB_ID)}
          >
            {COMMON_SLOTS_TAB_LABEL}
          </button>
          {interviewerTokens.map((iv) => (
            <button
              key={iv.id}
              type="button"
              className={`st-sidebar-item${activeTab === iv.id ? " st-sidebar-item--active" : ""}`}
              onClick={() => onSelect(iv.id)}
            >
              {iv.name}
            </button>
          ))}
        </div>
        <div className="st-sidebar-foot">
          {activeInterviewerName
            ? `Showing ${activeInterviewerName}'s slots`
            : "Showing common availability"}
        </div>
      </aside>
    </>
  );
};

export default MentionPopupSidebar;
