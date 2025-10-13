import { useState, useEffect } from 'react';
import { useTeam } from '@/hooks/useTeam';

export interface Notification {
  id: string;
  type: 'invitation' | 'team_update' | 'competition_result';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    this.notifications.unshift(newNotification);
    this.notifyListeners();
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  getAllNotifications(): Notification[] {
    return [...this.notifications];
  }

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }
}

export const notificationService = new NotificationService();

// Hook to use notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { invitations } = useTeam();

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  // Convert team invitations to notifications
  useEffect(() => {
    invitations.forEach(invitation => {
      const existingNotification = notifications.find(
        n => n.type === 'invitation' && n.message.includes(invitation.teamName)
      );

      if (!existingNotification) {
        notificationService.addNotification({
          type: 'invitation',
          title: 'Team Invitation',
          message: `You've been invited to join ${invitation.teamName}`,
          actionUrl: '/invitations',
        });
      }
    });
  }, [invitations, notifications]);

  return {
    notifications,
    unreadCount: notificationService.getUnreadCount(),
    markAsRead: (id: string) => notificationService.markAsRead(id),
    markAllAsRead: () => notificationService.markAllAsRead(),
  };
}
