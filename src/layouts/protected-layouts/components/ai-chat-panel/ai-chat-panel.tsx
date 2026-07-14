import InfoChipTooltip from "@/components/shared/info-chip-tooltip/info-chip-tooltip";
import { useAIChatPanel } from "@/layouts/protected-layouts/components/ai-chat-panel/hooks/use-ai-chat-panel";
import { AI_CHAT_PANEL } from "@/layouts/protected-layouts/components/ai-chat-panel/ai-chat-panel.constants";

import "./ai-chat-panel.css";

export default function AIChatPanel() {
  const {
    shouldRender,
    panelState,
    floatingInput,
    setFloatingInput,
    floatingInputRef,
    inputContainerRef,
    sidebarInput,
    setSidebarInput,
    sidebarInputRef,
    messages,
    messagesEndRef,
    tooltip,
    scanning,
    historyOpen,
    historyBtnRef,
    historyPopupRef,
    recentChats,
    handleAIPillClick,
    handlePillMouseEnter,
    handlePillMouseLeave,
    handleFloatingSend,
    handleFloatingKeyDown,
    handleSidebarSend,
    handleSidebarKeyDown,
    handleClose,
    handleNewChat,
    handleZoomToChat,
    handleSelectChat,
    toggleHistory,
  } = useAIChatPanel();

  if (!shouldRender) return null;

  return (
    <>
      {panelState === "idle" && (
        <button
          type="button"
          className="ai-pill"
          onClick={handleAIPillClick}
          onMouseEnter={handlePillMouseEnter}
          onMouseLeave={handlePillMouseLeave}
        >
          <span className="ai-pill-text">{AI_CHAT_PANEL.AI_PILL_TEXT}</span>
        </button>
      )}

      {panelState === "input" && (
        <div className="ai-panel-input" ref={inputContainerRef}>
          <div className="ai-panel-input-bar">
            <input
              ref={floatingInputRef}
              className="ai-panel-input-field"
              placeholder={AI_CHAT_PANEL.INPUT_PLACEHOLDER}
              value={floatingInput}
              onChange={(e) => setFloatingInput(e.target.value)}
              onKeyDown={handleFloatingKeyDown}
            />
            <button
              type="button"
              className="ai-panel-input-send"
              onClick={handleFloatingSend}
              disabled={!floatingInput.trim()}
              aria-label="Send"
            >
              <i className="bx bx-send-alt" />
            </button>
          </div>
        </div>
      )}

      {panelState === "panel" && (
        <aside className="ai-panel-sidebar">
          <div className="ai-panel-sidebar-header">
            <div className="ai-panel-sidebar-title-wrap">
              <i className="bx bx-bulb ai-panel-sidebar-icon" />
              <span className="ai-panel-sidebar-title">{AI_CHAT_PANEL.SIDEPANEL_TITLE}</span>
            </div>
            <div className="ai-panel-sidebar-actions">
              <button
                type="button"
                className="ai-panel-header-btn"
                onClick={handleNewChat}
                aria-label="New chat"
              >
                <i className="bx bx-plus" />
              </button>
              <button
                type="button"
                className="ai-panel-header-btn"
                onClick={handleZoomToChat}
                aria-label="Open in full chat"
              >
                <i className="bx bx-expand" />
              </button>
              <button
                ref={historyBtnRef}
                type="button"
                className="ai-panel-header-btn"
                onClick={toggleHistory}
                aria-label="Chat history"
              >
                <i className="bx bx-dots-vertical-rounded" />
              </button>
              <button
                type="button"
                className="ai-panel-header-btn"
                onClick={handleClose}
                aria-label="Close AI panel"
              >
                <i className="bx bx-x" />
              </button>
            </div>

            {historyOpen && (
              <div className="ai-panel-history-popup" ref={historyPopupRef} onClick={(e) => e.stopPropagation()}>
                <div className="ai-panel-history-header">
                  <i className="bx bx-time" />
                  <span>Recent conversations</span>
                </div>
                <div className="ai-panel-history-list">
                  {recentChats.length === 0 && (
                    <div className="ai-panel-history-empty">No conversations yet</div>
                  )}
                  {recentChats.slice(0, 10).map((chat) => (
                    <button
                      key={chat.id}
                      type="button"
                      className="ai-panel-history-item"
                      onClick={() => handleSelectChat(chat.id)}
                    >
                      <i className="bx bx-message" />
                      <div className="ai-panel-history-item-text">
                        <span className="ai-panel-history-item-title">{chat.title}</span>
                        <span className="ai-panel-history-item-date">
                          {new Date(chat.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="ai-panel-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`ai-panel-msg ai-panel-msg--${msg.role}`}
              >
                <div className="ai-panel-msg-bubble">{msg.content}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-panel-sidebar-footer">
            <div className="ai-panel-sidebar-input-wrap">
              <textarea
                ref={sidebarInputRef}
                className="ai-panel-sidebar-input"
                placeholder={AI_CHAT_PANEL.SIDEPANEL_INPUT_PLACEHOLDER}
                value={sidebarInput}
                onChange={(e) => setSidebarInput(e.target.value)}
                onKeyDown={handleSidebarKeyDown}
                rows={1}
              />
              <button
                type="button"
                className="ai-panel-sidebar-send"
                onClick={handleSidebarSend}
                disabled={!sidebarInput.trim()}
                aria-label="Send"
              >
                <i className="bx bx-send-alt" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {tooltip && <InfoChipTooltip className="ai-pill-tooltip" lines={tooltip.lines} rect={tooltip.rect} />}

      {scanning && <div className="ai-scanner" />}
    </>
  );
}
