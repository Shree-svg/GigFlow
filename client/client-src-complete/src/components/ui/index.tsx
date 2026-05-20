import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LeadStatus } from '../../types';

// ─── Button ─────────────────────────────────────────────

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md';
  loading?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-mono font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
  };

  const variants = {
    primary:
      'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/30',
    ghost:
      'bg-transparent hover:bg-white/10 text-white border border-white/10',
    danger:
      'bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/20',
    outline:
      'border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10',
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

// ─── Card ─────────────────────────────────────────────

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => (
  <div
    className={`bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-xl ${className}`}
  >
    {children}
  </div>
);

// ─── Badge ────────────────────────────────────────────

interface BadgeProps {
  status: LeadStatus;
}

export const Badge = ({ status }: BadgeProps) => {
  const classes: Record<LeadStatus, string> = {
    New: 'badge-new',
    Contacted: 'badge-contacted',
    Qualified: 'badge-qualified',
    Lost: 'badge-lost',
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-md font-mono text-[10px] tracking-wider font-semibold ${classes[status]}`}
    >
      {status}
    </span>
  );
};

// ─── StatusBadge (alias used by LeadsTable) ───────────────────────────────────

export const StatusBadge = Badge;

// ─── SkeletonRow ──────────────────────────────────────────────────────────────

export const SkeletonRow = () => (
  <tr className="border-b border-outline-variant/10 animate-pulse">
    {Array.from({ length: 5 }).map((_, i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-4 rounded bg-zinc-700/50 w-3/4" />
      </td>
    ))}
  </tr>
);

// ─── Spinner ──────────────────────────────────────────────────────────────────

export const Spinner = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className="animate-spin text-cyan-500"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12" cy="12" r="10"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="31.4 15.7"
    />
  </svg>
);

// ─── Modal ────────────────────────────────────────────

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-lg overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700">
                <h3 className="font-mono text-sm font-semibold text-on-surface tracking-wider uppercase">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
