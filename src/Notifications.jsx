import React, { useEffect, useState } from 'react';
import './Notifications.css';

const STORAGE_KEY = 'smartAmbulanceNotifications';

const seedNotifications = [
  { id: 1, message: 'Alpha ambulance is available', time: '2 min ago', read: false },
  { id: 2, message: 'Emergency queue synced with dashboard', time: '5 min ago', read: false },
  { id: 3, message: 'Latest route simulation is ready', time: '8 min ago', read: false }
];

const readNotifications = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return seedNotifications;

  try {
    return JSON.parse(saved);
  } catch {
    return seedNotifications;
  }
};

export const pushNotification = (message) => {
  const nextNotification = {
    id: Date.now(),
    message,
    time: 'Just now',
    read: false
  };
  const next = [nextNotification, ...readNotifications()].slice(0, 12);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('smart-ambulance-notification', { detail: nextNotification }));
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(readNotifications);
  const [showDropdown, setShowDropdown] = useState(false);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const saveNotifications = (next) => {
    setNotifications(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const markAsRead = (id) => {
    saveNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readNotifications()));

    const handleNotification = () => setNotifications(readNotifications());
    window.addEventListener('smart-ambulance-notification', handleNotification);
    window.addEventListener('storage', handleNotification);

    return () => {
      window.removeEventListener('smart-ambulance-notification', handleNotification);
      window.removeEventListener('storage', handleNotification);
    };
  }, []);

  return (
    <div className="notifications-wrapper">
      <button
        type="button"
        className={`notification-bell ${unreadCount > 0 ? 'has-alert' : ''}`}
        onClick={() => setShowDropdown((current) => !current)}
        aria-label="Open notifications"
      >
        🔔
        {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <span>Notifications</span>
            <button type="button" onClick={clearAll}>Clear All</button>
          </div>

          {notifications.length === 0 ? (
            <p className="no-notifications">No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => markAsRead(notification.id)}
              >
                <p>{notification.message}</p>
                <span className="notification-time">{notification.time}</span>
                {!notification.read && <span className="unread-dot"></span>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
