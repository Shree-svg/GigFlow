import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  onNewLead: () => void;
}

const navItems = [
  { icon: 'dashboard', label: 'Dashboard' },
  { icon: 'group', label: 'Leads' },
  { icon: 'insights', label: 'Analytics' },
  { icon: 'send', label: 'Campaigns' },
  { icon: 'settings', label: 'Settings' },
];

export const Sidebar = ({ onNewLead }: SidebarProps) => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <motion.nav
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col border-r border-outline-variant/20 bg-surface-container-lowest overflow-hidden group"
      style={{ width: 72 }}
      whileHover={{ width: 240 }}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0 animate-glow">
          <span className="material-symbols-outlined text-on-primary font-bold">speed</span>
        </div>
        <div className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          <p className="font-sora font-black text-on-surface text-sm leading-tight">LeadStream</p>
          <p className="font-mono text-[10px] text-on-surface-variant tracking-widest">INTELLIGENCE HUB</p>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {navItems.map((item, i) => (
          <motion.a
            key={item.label}
            href="#"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group/item
              ${i === 0
                ? 'bg-primary-container/10 text-primary-fixed border-r-4 border-primary-container font-bold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30'
              }`}
          >
            <span className="material-symbols-outlined shrink-0" style={i === 0 ? { fontVariationSettings: "'FILL' 1" } : {}}>
              {item.icon}
            </span>
            <span className="ml-3 font-mono text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {item.label.toUpperCase()}
            </span>
          </motion.a>
        ))}

        {isAdmin && (
          <motion.a
            href="#"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 transition-all duration-200"
          >
            <span className="material-symbols-outlined shrink-0">download</span>
            <span className="ml-3 font-mono text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">EXPORT</span>
          </motion.a>
        )}
      </div>

      {/* Bottom: new lead + user */}
      <div className="p-3 shrink-0 border-t border-outline-variant/10 space-y-2">
        <button
          onClick={onNewLead}
          className="w-full bg-primary-container text-on-primary py-2 px-3 rounded-lg font-mono text-xs tracking-wider animate-glow flex items-center justify-center gap-2 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span className="whitespace-nowrap">ADD NEW LEAD</span>
        </button>

        {/* User info */}
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center shrink-0 text-xs font-bold text-on-secondary-container">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-1 min-w-0">
            <p className="font-mono text-xs text-on-surface truncate">{user?.name}</p>
            <p className="font-mono text-[10px] text-primary-container tracking-wider">{user?.role.toUpperCase()}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center px-3 py-2 w-full rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-all"
        >
          <span className="material-symbols-outlined shrink-0 text-sm">logout</span>
          <span className="ml-3 font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">LOGOUT</span>
        </button>
      </div>
    </motion.nav>
  );
};
