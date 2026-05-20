import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast } from '../components/ui/Toast';

type Notification = {
  id: number;
  message: string;
  type?: 'info' | 'success' | 'error' | 'warning';
};

type NotificationContextValue = {
  addNotification: (msg: string, type?: Notification['type']) => void;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const nextIdRef = useState(0)[0];

  const remove = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback((message: string, type: Notification['type'] = 'info') => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message, type }]);
    // auto remove after 4s
    setTimeout(() => remove(id), 4000);
  }, [remove]);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <Toast notifications={notifications} onDismiss={remove} />
    </NotificationContext.Provider>
  );
};
