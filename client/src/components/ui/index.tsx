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

interface StatusBadgeProps {
  status: LeadStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const colors: Record<LeadStatus, string> = {
    New: 'bg-blue-500/20 text-blue-400',
    Contacted: 'bg-yellow-500/20 text-yellow-400',
    Qualified: 'bg-green-500/20 text-green-400',
    Lost: 'bg-red-500/20 text-red-400',
  };

  return (
    <span
      className={`px-2 py-1 rounded-md text-xs font-medium ${colors[status]}`}
    >
      {status}
    </span>
  );
};

// ─── Spinner ───────────────────────────────────────────

interface SpinnerProps {
  size?: number;
  className?: string;
}

export const Spinner = ({ size = 24, className = '' }: SpinnerProps) => (
  <div
    className={`inline-block animate-spin rounded-full border-2 border-primary-container border-t-transparent ${className}`}
    style={{ width: size, height: size }}
  />
);

// ─── Skeleton Row ──────────────────────────────────────

const skeletonWidths = ['w-36', 'w-24', 'w-20', 'w-28', 'w-16'];

export const SkeletonRow = () => (
  <tr className="border-b border-outline-variant/10">
    {skeletonWidths.map((width, index) => (
      <td key={`${width}-${index}`} className="px-5 py-4">
        <div className={`h-3 ${width} bg-surface-variant/30 rounded animate-pulse`} />
      </td>
    ))}
  </tr>
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
            className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="mb-4">
                <h3 className="font-sora text-lg text-on-surface">{title}</h3>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
