import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  search: string;
  onSearch: (v: string) => void;
  activeTab?: string;
  onTabChange?: (tab: 'dashboard' | 'analytics' | 'campaigns' | 'settings') => void;
}


interface NotificationItem {
  id: string;
  text: string;
  time: string;
  unread: boolean;
  icon: string;
}

export const Navbar = ({ search, onSearch, activeTab = 'dashboard', onTabChange }: NavbarProps) => {
  const { isDark, toggle } = useTheme();
  const { user, isAdmin } = useAuth();
  
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      text: 'New lead John Miller captured from Website.',
      time: '5 mins ago',
      unread: true,
      icon: 'person_add',
    },
    {
      id: '2',
      text: 'Campaign "Q2 Enterprise Drip" has been activated.',
      time: '1 hour ago',
      unread: true,
      icon: 'campaign',
    },
    {
      id: '3',
      text: 'Lead Alice Smith status upgraded to CONTACTED.',
      time: '2 hours ago',
      unread: false,
      icon: 'update',
    },
    {
      id: '4',
      text: 'Monthly sales performance report generated.',
      time: '1 day ago',
      unread: false,
      icon: 'task_alt',
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 h-16 border-b border-outline-variant/10 bg-surface-container/60 backdrop-blur-xl shadow-[0_0_15px_rgba(0,245,255,0.05)]"
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        {activeTab === 'dashboard' ? (
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search leads by name or email…"
              className="w-full bg-transparent border-b border-outline-variant/30 text-on-surface pl-9 pr-3 py-1.5 font-hanken text-sm focus:outline-none focus:border-primary-container transition-colors placeholder-on-surface-variant/50"
            />
          </div>
        ) : (
          <div className="h-9" /> // placeholder spacer to preserve layout spacing
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 relative">
        {/* Theme toggle */}
        <motion.button
          onClick={toggle}
          whileTap={{ rotate: 180 }}
          transition={{ duration: 0.4 }}
          className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-variant/50 transition-colors"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <span className="material-symbols-outlined text-sm">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`relative p-1.5 rounded-full text-on-surface-variant hover:bg-surface-variant/50 transition-colors ${notificationsOpen ? 'bg-surface-variant/50' : ''}`}
            title="Notifications"
          >
            <span className="material-symbols-outlined text-sm">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full animate-pulse shadow-[0_0_8px_#ff453a]" />
            )}
          </button>

          {/* Click outside overlay */}
          {notificationsOpen && (
            <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
          )}

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 glass-panel rounded-xl border border-outline-variant/15 p-4 shadow-2xl z-50 bg-surface-container-high/95 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between border-b border-outline-variant/10 pb-2 mb-2">
                  <span className="font-sora font-semibold text-xs text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary-fixed">notifications</span>
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="font-mono text-[9px] text-primary-fixed hover:underline"
                    >
                      MARK ALL READ
                    </button>
                  )}
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-on-surface-variant/60 text-xs font-hanken">
                      No notifications to display
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => toggleNotification(n.id)}
                        className={`flex gap-3 p-2 rounded-lg transition-colors cursor-pointer text-left
                          ${n.unread ? 'bg-primary-container/5 border-l-2 border-primary-container' : 'hover:bg-surface-variant/20'}`}
                      >
                        <span className={`material-symbols-outlined text-sm mt-0.5 shrink-0
                          ${n.unread ? 'text-primary-fixed' : 'text-on-surface-variant/60'}`}>
                          {n.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-hanken text-[11px] leading-tight break-words
                            ${n.unread ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}>
                            {n.text}
                          </p>
                          <span className="font-mono text-[9px] text-on-surface-variant/40 mt-1 block">
                            {n.time}
                          </span>
                        </div>
                        {n.unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-container mt-1.5 shrink-0" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User chip / Profile Button */}
        <div className="relative flex items-center pl-2 border-l border-outline-variant/20">
          <button
            onClick={() => {
              if (onTabChange) onTabChange('settings');
            }}
            className={`flex items-center gap-2 p-1.5 rounded-lg text-left hover:bg-surface-variant/40 transition-colors ${activeTab === 'settings' ? 'bg-primary-container/10 border border-primary-container/20' : ''}`}
            title="View Profile & Settings"
          >
            <div className="w-8 h-8 rounded-full bg-secondary-container border border-outline-variant/30 flex items-center justify-center text-sm font-bold text-on-secondary-container">
              {user?.name ? user.name.charAt(0).toUpperCase() : ''}
            </div>
            <div className="hidden sm:block">
              <p className="font-mono text-xs text-on-surface leading-none">{user?.name}</p>
              <p className={`font-mono text-[9px] tracking-wider mt-0.5 leading-none ${isAdmin ? 'text-primary-container' : 'text-on-surface-variant'}`}>
                {user?.role.toUpperCase()}
              </p>
            </div>
          </button>
        </div>
      </div>
    </motion.header>
  );
};
