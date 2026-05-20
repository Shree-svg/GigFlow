import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

type Notification = {
  id: number;
  message: string;
  type?: 'info' | 'success' | 'error' | 'warning';
};

type ToastProps = {
  notifications: Notification[];
  onDismiss: (id: number) => void;
};

const typeColors: Record<NonNullable<Notification['type']>, string> = {
  info: 'bg-primary-container text-on-primary',
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-amber-500 text-white',
};

export const Toast = ({ notifications, onDismiss }: ToastProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto rounded-xl px-4 py-2 shadow-lg ${typeColors[n.type ?? 'info']} min-w-[240px]`}
            onClick={() => onDismiss(n.id)}
          >
            <div className="flex items-center">
              <span className="material-symbols-outlined mr-2 text-sm">
                {n.type === 'success' ? 'check_circle' : n.type === 'error' ? 'error' : n.type === 'warning' ? 'warning' : 'info'}
              </span>
              <span className="font-mono text-sm flex-1 truncate">{n.message}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
