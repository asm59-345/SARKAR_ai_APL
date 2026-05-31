import { create } from 'zustand';

export interface AlertNotification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'escalation';
  timestamp: string;
  read: boolean;
}

interface NotificationState {
  notifications: AlertNotification[];
  addNotification: (n: Omit<AlertNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  toast: AlertNotification | null;
  clearToast: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    {
      id: 'n1',
      title: 'System Initialized',
      description: 'SarkarAI Autonomous Workflow OS is online and connected to Nagar Nigam servers.',
      type: 'info',
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(),
      read: false
    },
    {
      id: 'n2',
      title: 'Escalation Handled',
      description: 'Hazratganj Road Repair complaint has been auto-escalated due to delay.',
      type: 'escalation',
      timestamp: new Date(Date.now() - 1800000).toLocaleTimeString(),
      read: false
    }
  ],
  addNotification: (n) => {
    const newAlert: AlertNotification = {
      ...n,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      read: false
    };
    set((state) => ({
      notifications: [newAlert, ...state.notifications],
      toast: newAlert
    }));
  },
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
  })),
  clearAll: () => set({ notifications: [] }),
  toast: null,
  clearToast: () => set({ toast: null })
}));
