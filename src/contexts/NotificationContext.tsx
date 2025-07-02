import { createContext, useContext, useState } from 'react';
import { NotificationDto } from '../types/Notification';

interface NotificationContextType {
  notifications: NotificationDto[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationDto[]>>;
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, unreadCount, setUnreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotificationContext must be used within NotificationProvider');
  return context;
};