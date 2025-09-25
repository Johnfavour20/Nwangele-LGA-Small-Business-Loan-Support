import React from 'react';
import type { Notification } from '../../types';
import { NotificationItem } from './NotificationItem';

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigate: (link: Notification['link']) => void;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigate,
  onClose,
}) => {
  return (
    <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border animate-fade-in origin-top-right overflow-hidden z-30">
      <div className="p-4 flex justify-between items-center border-b">
        <h3 className="font-bold text-gray-800">Notifications</h3>
        {notifications.some(n => !n.isRead) && (
            <button
                onClick={onMarkAllAsRead}
                className="text-sm font-semibold text-green-700 hover:text-green-600 focus:outline-none"
            >
                Mark all as read
            </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((n) => (
              <li key={n.id}>
                <NotificationItem
                  notification={n}
                  onMarkAsRead={onMarkAsRead}
                  onNavigate={onNavigate}
                  onClosePanel={onClose}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center p-8 text-sm text-gray-500">You're all caught up!</p>
        )}
      </div>
    </div>
  );
};
