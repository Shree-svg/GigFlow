import { motion } from 'framer-motion';
import { useTheme } from '../../hooks';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  search: string;
  onSearch: (v: string) => void;
}

export const Navbar = ({ search, onSearch }: NavbarProps) => {
  const { isDark, toggle } = useTheme();
  const { user, isAdmin } = useAuth();

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 h-16 border-b border-outline-variant/10 bg-surface-container/60 backdrop-blur-xl shadow-[0_0_15px_rgba(0,245,255,0.05)]"
      style={{ marginLeft: 72 }}
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search leads by name or email…"
            className="w-full bg-transparent border-b border-outline-variant/30 text-on-surface pl-9 pr-3 py-1.5 font-hanken text-sm focus:outline-none focus:border-primary-container transition-colors placeholder-on-surface-variant/50"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
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
        <button className="relative p-1.5 rounded-full text-on-surface-variant hover:bg-surface-variant/50 transition-colors">
          <span className="material-symbols-outlined text-sm">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
        </button>

        {/* User chip */}
        <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/20">
          <div className="w-8 h-8 rounded-full bg-secondary-container border border-outline-variant/30 flex items-center justify-center text-sm font-bold text-on-secondary-container">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="font-mono text-xs text-on-surface leading-tight">{user?.name}</p>
            <p className={`font-mono text-[10px] tracking-wider leading-tight ${isAdmin ? 'text-primary-container' : 'text-on-surface-variant'}`}>
              {user?.role.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
