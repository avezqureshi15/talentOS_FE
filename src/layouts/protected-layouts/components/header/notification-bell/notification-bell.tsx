import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "@/store/notification.store";
import { getNotificationMeta } from "@/services/notifications/notification.meta";
import { ROUTES } from "@/constants/routes";
import "./notification-bell.css";

function formatRelativeTime(createdAt: string): string {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const NotificationBell = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const latest = useNotificationStore((s) => s.latest);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleItemClick = (id: string, actionUrl: string | null) => {
    void markRead(id);
    setOpen(false);
    if (actionUrl) {
      navigate(actionUrl);
    }
  };

  return (
    <div className="notification-bell" ref={ref}>
      <button
        type="button"
        className="notification-bell__trigger"
        onClick={() => setOpen((v) => !v)}
        title="Notifications"
        aria-label="Notifications"
      >
        <i className="bx bx-bell" />
        {unreadCount > 0 && (
          <span className="notification-bell__badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-bell__dropdown">
          <div className="notification-bell__header">
            <span className="notification-bell__title">Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                className="notification-bell__mark-all"
                onClick={() => void markAllRead()}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-bell__list">
            {latest.length === 0 ? (
              <div className="notification-bell__empty">
                <i className="bx bx-bell-off" />
                <span>No new notifications</span>
              </div>
            ) : (
              latest.map((n) => {
                const meta = getNotificationMeta(n.type);
                return (
                  <button
                    key={n.id}
                    type="button"
                    className="notification-bell__item"
                    onClick={() => handleItemClick(n.id, n.action_url)}
                  >
                    <span className={`notification-bell__item-icon notification-bell__item-icon--${meta.tab}`}>
                      <i className={meta.icon} />
                    </span>
                    <span className="notification-bell__item-content">
                      <span className="notification-bell__item-title">{n.title}</span>
                      {n.body && <span className="notification-bell__item-body">{n.body}</span>}
                      <span className="notification-bell__item-time">{formatRelativeTime(n.created_at)}</span>
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <div className="notification-bell__footer">
            <button
              type="button"
              className="notification-bell__view-all"
              onClick={() => {
                setOpen(false);
                navigate(ROUTES.NOTIFICATIONS);
              }}
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
