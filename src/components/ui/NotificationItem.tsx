import React from 'react';
import type { Notification } from '../../types';
import { ICONS } from '../../constants';
import { formatRelativeTime } from '../../utils/time';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onNavigate: (link: Notification['link']) => void;
  onClosePanel: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onNavigate,
  onClosePanel,
}) => {
  const iconMap: Record<Notification['type'], React.ReactNode> = {
    message: ICONS.message,
    status_update: ICONS.applications,
    new_application: ICONS.applications,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    if (notification.link) {
      onNavigate(notification.link);
    }
    onClosePanel();
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className={`relative flex items-start gap-4 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
        !notification.isRead ? 'bg-green-50/50 dark:bg-green-900/20' : 'bg-white dark:bg-slate-800'
      }`}
    >
      {!notification.isRead && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 bg-blue-500 rounded-full" aria-label="Unread"></div>
      )}
      <div className="flex-shrink-0 text-slate-500 w-6 h-6 mt-0.5 ml-2">{iconMap[notification.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{notification.title}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">{notification.message}</p>
        <p className="text-xs text-slate-400 mt-1">{formatRelativeTime(notification.timestamp)}</p>
      </div>
    </a>
  );
};
