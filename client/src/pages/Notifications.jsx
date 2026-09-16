import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Trash2,
  Check,
  RefreshCw,
  Wallet,
  PiggyBank,
  Repeat,
  Trophy,
  CircleAlert,
} from "lucide-react";
import api from "../services/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  // =========================
  // FETCH NOTIFICATIONS
  // =========================
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await api.get("/notifications");

      setNotifications(
        response.data.notifications || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch notifications:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // =========================
  // CHECK IF STORED
  // =========================
  const isStoredNotification = (notification) => {
    return Boolean(notification.id);
  };

  // =========================
  // MARK ONE AS READ
  // =========================
  const markAsRead = async (id) => {
    if (!id) return;

    try {
      await api.patch(
        `/notifications/${id}/read`
      );

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Mark as read error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update notification."
      );
    }
  };

  // =========================
  // MARK ALL AS READ
  // =========================
  const markAllAsRead = async () => {
    try {
      setMarkingAll(true);

      await api.patch(
        "/notifications/read-all"
      );

      setNotifications((previous) =>
        previous.map((notification) =>
          isStoredNotification(notification)
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Mark all as read error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update notifications."
      );
    } finally {
      setMarkingAll(false);
    }
  };

  // =========================
  // DELETE ONE
  // =========================
  const deleteNotification = async (id) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Delete this notification?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/notifications/${id}`
      );

      setNotifications((previous) =>
        previous.filter(
          (notification) =>
            notification.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete notification."
      );
    }
  };

  // =========================
  // NOTIFICATION TYPE
  // =========================
  const getTypeDetails = (type) => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle,
          label: "Success",
          card:
            "border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:border-emerald-900/60 dark:from-emerald-950/30 dark:via-[#15151d] dark:to-green-950/20",
          iconBox:
            "border-emerald-200 bg-emerald-100 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400",
          category:
            "border-emerald-200 bg-emerald-100/80 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
          type:
            "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-400",
        };

      case "warning":
        return {
          icon: AlertTriangle,
          label: "Warning",
          card:
            "border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-yellow-50 dark:border-amber-900/60 dark:from-amber-950/30 dark:via-[#15151d] dark:to-yellow-950/20",
          iconBox:
            "border-amber-200 bg-amber-100 text-amber-600 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-400",
          category:
            "border-amber-200 bg-amber-100/80 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400",
          type:
            "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-400",
        };

      case "danger":
        return {
          icon: CircleAlert,
          label: "Urgent",
          card:
            "border-red-200/80 bg-gradient-to-br from-red-50 via-white to-rose-50 dark:border-red-900/60 dark:from-red-950/30 dark:via-[#15151d] dark:to-rose-950/20",
          iconBox:
            "border-red-200 bg-red-100 text-red-600 dark:border-red-800 dark:bg-red-950/60 dark:text-red-400",
          category:
            "border-red-200 bg-red-100/80 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400",
          type:
            "border-red-200 bg-red-50 text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400",
        };

      default:
        return {
          icon: Info,
          label: "Information",
          card:
            "border-violet-200/80 bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:border-violet-900/60 dark:from-violet-950/30 dark:via-[#15151d] dark:to-purple-950/20",
          iconBox:
            "border-violet-200 bg-violet-100 text-violet-600 dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-400",
          category:
            "border-violet-200 bg-violet-100/80 text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-400",
          type:
            "border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-900/60 dark:bg-violet-950/30 dark:text-violet-400",
        };
    }
  };

  // =========================
  // CATEGORY ICON
  // =========================
  const getCategoryIcon = (category) => {
    switch (category) {
      case "budget":
        return <Wallet size={15} />;

      case "savings":
        return <PiggyBank size={15} />;

      case "recurring":
        return <Repeat size={15} />;

      case "gamification":
        return <Trophy size={15} />;

      default:
        return <Bell size={15} />;
    }
  };

  // =========================
  // DATE FORMAT
  // =========================
  const formatDate = (date) => {
    if (!date) {
      return "Just now";
    }

    const notificationDate =
      new Date(date);

    const now = new Date();

    const difference =
      now.getTime() -
      notificationDate.getTime();

    const minutes = Math.floor(
      difference / (1000 * 60)
    );

    const hours = Math.floor(
      difference / (1000 * 60 * 60)
    );

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    if (days < 7) {
      return `${days} day${
        days > 1 ? "s" : ""
      } ago`;
    }

    return notificationDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================
  // COUNTS
  // =========================
  const unreadCount =
    notifications.filter(
      (notification) =>
        notification.isRead === false
    ).length;

  const readCount =
    notifications.filter(
      (notification) =>
        notification.isRead === true
    ).length;

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-full w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[360px] w-full max-w-7xl items-center justify-center rounded-3xl border border-slate-200/80 bg-white/70 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-[#15151d]/70">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
              <RefreshCw
                size={22}
                className="animate-spin"
              />
            </div>

            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Loading notifications...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200 bg-violet-100 text-violet-600 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-400">
                <Bell size={21} />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
                  Updates & Alerts
                </p>

                <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  Notifications
                </h1>
              </div>

              {unreadCount > 0 && (
                <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-2 text-xs font-extrabold text-white shadow-md shadow-violet-500/20">
                  {unreadCount}
                </span>
              )}
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
              Important updates from your Apna Khata.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={fetchNotifications}
              type="button"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            {unreadCount > 0 && (
              <button
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 dark:border-violet-500/30"
                onClick={markAllAsRead}
                disabled={markingAll}
                type="button"
              >
                <Check size={17} />

                {markingAll
                  ? "Updating..."
                  : "Mark All Read"}
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Total */}
          <div className="rounded-3xl border border-violet-200/70 bg-gradient-to-br from-violet-50 via-white to-purple-50 p-5 shadow-lg shadow-violet-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-violet-900/60 dark:from-violet-950/30 dark:via-[#15151d] dark:to-purple-950/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-violet-700 dark:text-violet-400">
                  Total
                </p>

                <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                  {notifications.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200 bg-violet-100 text-violet-600 dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-400">
                <Bell size={21} />
              </div>
            </div>
          </div>

          {/* Unread */}
          <div className="rounded-3xl border border-amber-200/70 bg-gradient-to-br from-amber-50 via-white to-yellow-50 p-5 shadow-lg shadow-amber-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-amber-900/60 dark:from-amber-950/30 dark:via-[#15151d] dark:to-yellow-950/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Unread
                </p>

                <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                  {unreadCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200 bg-amber-100 text-amber-600 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-400">
                <CircleAlert size={21} />
              </div>
            </div>
          </div>

          {/* Read */}
          <div className="rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-5 shadow-lg shadow-emerald-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-emerald-900/60 dark:from-emerald-950/30 dark:via-[#15151d] dark:to-green-950/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Read
                </p>

                <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                  {readCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-100 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                <CheckCircle size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* Notification List */}
        <div>
          {notifications.length === 0 ? (
            <div className="rounded-3xl border border-slate-200/80 bg-white/75 px-6 py-14 text-center shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-[#15151d]/75">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-200 bg-violet-100 text-violet-600 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-400">
                <Bell size={28} />
              </div>

              <h3 className="mt-5 text-xl font-extrabold text-slate-900 dark:text-white">
                No notifications
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                You're all caught up. There are no new updates right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {notifications.map(
                (notification, index) => {
                  const typeDetails =
                    getTypeDetails(
                      notification.type
                    );

                  const TypeIcon =
                    typeDetails.icon;

                  const stored =
                    isStoredNotification(
                      notification
                    );

                  const isUnread =
                    notification.isRead ===
                    false;

                  return (
                    <div
                      key={
                        notification.id ||
                        `${notification.category}-${notification.title}-${index}`
                      }
                      className={`group relative overflow-hidden rounded-3xl border p-5 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:p-6 ${
                        typeDetails.card
                      } ${
                        isUnread
                          ? "ring-2 ring-violet-500/10"
                          : ""
                      }`}
                    >
                      {/* Decorative glow */}
                      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/40 blur-3xl dark:bg-white/5" />

                      <div className="relative flex flex-col gap-5 sm:flex-row">

                        {/* Icon */}
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${typeDetails.iconBox}`}
                        >
                          <TypeIcon size={22} />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">

                          {/* Top row */}
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap items-center gap-2">

                              <div
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider ${typeDetails.category}`}
                              >
                                {getCategoryIcon(
                                  notification.category
                                )}

                                <span>
                                  {
                                    notification.category
                                  }
                                </span>
                              </div>

                              <span
                                className={`rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider ${typeDetails.type}`}
                              >
                                {typeDetails.label}
                              </span>

                              {stored &&
                                isUnread && (
                                  <span className="rounded-full border border-violet-200 bg-violet-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-400">
                                    Unread
                                  </span>
                                )}
                            </div>

                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                              {formatDate(
                                notification.createdAt
                              )}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="mt-4 text-lg font-extrabold leading-snug text-slate-900 dark:text-white">
                            {notification.title}
                          </h3>

                          {/* Message */}
                          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {notification.message}
                          </p>

                          {/* Actions */}
                          <div className="mt-5 flex flex-wrap gap-2">

                            {stored &&
                              isUnread && (
                                <button
                                  className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-100 px-3.5 py-2 text-xs font-extrabold text-violet-700 transition-all hover:-translate-y-0.5 hover:bg-violet-200 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-400 dark:hover:bg-violet-950/80"
                                  onClick={() =>
                                    markAsRead(
                                      notification.id
                                    )
                                  }
                                  title="Mark as read"
                                  type="button"
                                >
                                  <Check size={15} />
                                  Mark Read
                                </button>
                              )}

                            {stored && (
                              <button
                                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-extrabold text-red-600 transition-all hover:-translate-y-0.5 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/70"
                                onClick={() =>
                                  deleteNotification(
                                    notification.id
                                  )
                                }
                                title="Delete notification"
                                type="button"
                              >
                                <Trash2 size={15} />
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;