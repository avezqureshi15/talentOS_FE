import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import Button from "@/components/ui/button/button";
import Skeleton from "@/components/ui/skeleton/skeleton";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import { useNotificationsData } from "../hooks/use-notifications-data";
import { NOTIFICATION_TABS, getNotificationMeta } from "@/services/notifications/notification.meta";
import { sendReminderByForm } from "@/services/notifications/notifications";
import { useNotificationStore } from "@/store/notification.store";
import { formatRelativeTime, formatFullTime, groupNotifications } from "./notifications.utils";
import { spring, fadeSlideUp } from "@/utils/motion";
import type { NotificationTab } from "@/services/notifications/notification.meta";
import type { NotificationApiItem } from "@/services/notifications/notifications.types";
import "./notifications.css";

const Notifications = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [remindingId, setRemindingId] = useState<string | null>(null);

  const sub = (searchParams.get("sub") as NotificationTab | null) ?? "all";
  const {
    notifications,
    hasMore,
    isLoading,
    isFetchingNextPage,
    loadMore,
    markRead,
    tabCounts,
  } = useNotificationsData(sub);
  const addToast = useToastStore((s) => s.addToast);
  const storeMarkAllRead = useNotificationStore((s) => s.markAllRead);

  const groups = groupNotifications(notifications);
  const totalUnread = tabCounts.all;

  const setSub = (key: NotificationTab) => setSearchParams({ sub: key });

  const handleMarkRead = useCallback(
    (n: NotificationApiItem) => {
      if (n.is_read) return;
      setMarkingId(n.id);
      markRead(n.id);
      setTimeout(() => setMarkingId(null), 400);
    },
    [markRead],
  );

  const handleRemind = async (n: NotificationApiItem) => {
    if (!n.form_id) return;
    setRemindingId(n.id);
    try {
      await sendReminderByForm(n.form_id);
      addToast("Reminder sent", ToastType.SUCCESS);
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Reminder failed", ToastType.ERROR);
    } finally {
      setRemindingId(null);
    }
  };

  const handleMarkAllRead = useCallback(async () => {
    await storeMarkAllRead();
    addToast("All notifications marked as read", ToastType.SUCCESS);
  }, [storeMarkAllRead, addToast]);

  const handleAction = useCallback(
    (n: NotificationApiItem) => {
      if (n.action_url) {
        void handleMarkRead(n);
        navigate(n.action_url);
      }
    },
    [handleMarkRead, navigate],
  );

  return (
    <>
      <PageHeader title="Notifications" titleIcon="bx bx-bell" />
      <ErrorBoundary>
        <motion.div
          className="notifications-page"
          variants={fadeSlideUp}
          initial="hidden"
          animate="visible"
          transition={spring}
        >
          <div className="notifications-content">
            <div className="notifications-header">
              <div className="notifications-segment" role="tablist" aria-label="Notification filters">
                {NOTIFICATION_TABS.map((t) => {
                  const active = sub === t.key;
                  const count = tabCounts[t.key];
                  return (
                    <button
                      key={t.key}
                      role="tab"
                      aria-selected={active}
                      type="button"
                      className={`notifications-segment__tab${active ? " notifications-segment__tab--active" : ""}`}
                      onClick={() => setSub(t.key)}
                    >
                      <i className={t.icon} />
                      <span className="notifications-segment__label">{t.label}</span>
                      {count > 0 && (
                        <span
                          className={`notifications-segment__badge${
                            active ? " notifications-segment__badge--active" : ""
                          }`}
                        >
                          {count > 99 ? "99+" : count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="notifications-header__actions">
                <Button
                  className="notifications-mark-all"
                  variant="ghost"
                  size="sm"
                  icon="bx bx-check-double"
                  disabled={totalUnread === 0}
                  onClick={() => void handleMarkAllRead()}
                >
                  Mark all as read
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="notifications-list notifications-list--loading" aria-busy="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="notifications-item notifications-item--skeleton">
                    <Skeleton width="40px" height="40px" borderRadius="12px" />
                    <div className="notifications-item__main">
                      <Skeleton width="35%" height="14px" />
                      <Skeleton width="70%" height="14px" />
                      <Skeleton width="50%" height="12px" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="notifications-empty">
                <i className="bx bx-bell-off" />
                <span>No notifications here</span>
                <span className="notifications-empty__hint">You're all caught up</span>
              </div>
            ) : (
              <div className="notifications-list">
                {groups.map((group) => (
                  <section key={group.label} className="notifications-group" aria-label={group.label}>
                    <h3 className="notifications-group__label">{group.label}</h3>
                    <div className="notifications-group__items">
                      {group.items.map((n) => {
                        const meta = getNotificationMeta(n.type);
                        const unread = !n.is_read;
                        return (
                          <div
                            key={n.id}
                            className={`notifications-item${
                              unread ? " notifications-item--unread" : " notifications-item--read"
                            }`}
                            style={{ "--item-accent": `var(--notif-${meta.tab})` } as React.CSSProperties}
                          >
                            <span className={`notifications-item__icon notifications-item__icon--${meta.tab}`}>
                              <i className={meta.icon} />
                              {unread && <span className="notifications-item__dot" />}
                            </span>
                            <div className="notifications-item__main">
                              <div className="notifications-item__top">
                                <span className="notifications-item__chip">{meta.label}</span>
                                <time
                                  className="notifications-item__time"
                                  title={formatFullTime(n.created_at)}
                                >
                                  {formatRelativeTime(n.created_at)}
                                </time>
                              </div>
                              <h4 className="notifications-item__title">{n.title}</h4>
                              {n.body && <p className="notifications-item__body">{n.body}</p>}
                            </div>
                            <div className="notifications-item__side">
                              <div className="notifications-item__actions">
                                {(n.type === "REVIEW" || n.type === "SLOTS") && n.form_id ? (
                                  <>
                                    <Button
                                      className="notifications-item__action"
                                      variant={unread ? "primary" : "secondary"}
                                      size="sm"
                                      icon="bx bx-bell-ring"
                                      loading={remindingId === n.id}
                                      loadingText="Sending..."
                                      onClick={() => void handleRemind(n)}
                                    >
                                      Send reminder
                                    </Button>
                                    {n.action_url && (
                                      <Button
                                        className="notifications-item__action notifications-item__open"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleAction(n)}
                                      >
                                        Open form
                                      </Button>
                                    )}
                                  </>
                                ) : (
                                  n.action_url &&
                                  n.action_label && (
                                    <Button
                                      className="notifications-item__action"
                                      variant={unread ? "primary" : "secondary"}
                                      size="sm"
                                      onClick={() => handleAction(n)}
                                    >
                                      {n.action_label}
                                    </Button>
                                  )
                                )}
                              </div>
                              <div className="notifications-item__quick" role="group" aria-label="Quick actions">
                                {unread && (
                                  <button
                                    type="button"
                                    className="notifications-item__quick-btn"
                                    title="Mark as read"
                                    onClick={() => handleMarkRead(n)}
                                    disabled={markingId === n.id}
                                  >
                                    <i
                                      className={
                                        markingId === n.id
                                          ? "bx bx-loader-alt bx-spin"
                                          : "bx bx-check"
                                      }
                                    />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}

                {hasMore && (
                  <div className="notifications-loadmore">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon="bx bx-loader-alt bx-spin"
                      loading={isFetchingNextPage}
                      loadingText="Loading..."
                      onClick={loadMore}
                    >
                      Load more
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </ErrorBoundary>
    </>
  );
};

export default Notifications;
