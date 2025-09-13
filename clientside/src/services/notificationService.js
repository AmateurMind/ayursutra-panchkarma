import axios from 'axios';

export const notificationService = {
  // Get all notifications for a user
  async getUserNotifications(userId, backendUrl, token) {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/notifications`, {
        headers: { token },
        params: { userId }
      });

      if (data.success) {
        return data.notifications || [];
      } else {
        throw new Error(data.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      return [];
    }
  },

  // Get unread notifications count
  async getUnreadNotificationsCount(userId, backendUrl, token) {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/notifications/unread-count`, {
        headers: { token },
        params: { userId }
      });

      if (data.success) {
        return data.count || 0;
      } else {
        return 0;
      }
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
      return 0;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId, backendUrl, token) {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/user/notifications/${notificationId}/read`,
        {},
        { headers: { token } }
      );

      if (data.success) {
        return data.notification;
      } else {
        throw new Error(data.message || 'Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead(userId, backendUrl, token) {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/user/notifications/mark-all-read`,
        { userId },
        { headers: { token } }
      );

      if (data.success) {
        return data.notifications || [];
      } else {
        throw new Error(data.message || 'Failed to mark all notifications as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Create notification (usually done by backend)
  async createNotification(notificationData, backendUrl, token) {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/notifications`,
        notificationData,
        { headers: { token } }
      );

      if (data.success) {
        return data.notification;
      } else {
        throw new Error(data.message || 'Failed to create notification');
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Delete notification
  async deleteNotification(notificationId, backendUrl, token) {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/user/notifications/${notificationId}`,
        { headers: { token } }
      );

      if (data.success) {
        return true;
      } else {
        throw new Error(data.message || 'Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Get appointment reminders
  async getAppointmentReminders(userId, backendUrl, token) {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointment-reminders`, {
        headers: { token },
        params: { userId }
      });

      if (data.success) {
        return data.reminders || [];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching appointment reminders:', error);
      return [];
    }
  },

  // Send custom notification (for contact forms, etc.)
  async sendContactNotification(contactData, backendUrl) {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/notifications/contact`,
        contactData
      );

      if (data.success) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to send contact notification');
      }
    } catch (error) {
      console.error('Error sending contact notification:', error);
      throw error;
    }
  },

  // Get system announcements
  async getSystemAnnouncements(backendUrl) {
    try {
      const { data } = await axios.get(`${backendUrl}/api/announcements`);

      if (data.success) {
        return data.announcements || [];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching system announcements:', error);
      return [];
    }
  },

  // Schedule appointment reminder
  async scheduleAppointmentReminder(appointmentId, reminderTime, backendUrl, token) {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/schedule-reminder`,
        {
          appointmentId,
          reminderTime,
          type: 'appointment_reminder'
        },
        { headers: { token } }
      );

      if (data.success) {
        return data.reminder;
      } else {
        throw new Error(data.message || 'Failed to schedule reminder');
      }
    } catch (error) {
      console.error('Error scheduling appointment reminder:', error);
      throw error;
    }
  },

  // Update notification preferences
  async updateNotificationPreferences(userId, preferences, backendUrl, token) {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/user/notification-preferences`,
        {
          userId,
          preferences
        },
        { headers: { token } }
      );

      if (data.success) {
        return data.preferences;
      } else {
        throw new Error(data.message || 'Failed to update notification preferences');
      }
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  },

  // Get notification preferences
  async getNotificationPreferences(userId, backendUrl, token) {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/notification-preferences`, {
        headers: { token },
        params: { userId }
      });

      if (data.success) {
        return data.preferences || {
          email: true,
          sms: false,
          push: true,
          appointmentReminders: true,
          systemUpdates: false,
          marketingEmails: false
        };
      } else {
        return {
          email: true,
          sms: false,
          push: true,
          appointmentReminders: true,
          systemUpdates: false,
          marketingEmails: false
        };
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      return {
        email: true,
        sms: false,
        push: true,
        appointmentReminders: true,
        systemUpdates: false,
        marketingEmails: false
      };
    }
  }
};

// Helper function to format notification for display
export const formatNotification = (notification) => {
  const now = new Date();
  const notificationDate = new Date(notification.createdAt || notification.date);
  const diffInHours = Math.floor((now - notificationDate) / (1000 * 60 * 60));
  
  let timeAgo;
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    timeAgo = diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    timeAgo = `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    timeAgo = `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  return {
    ...notification,
    timeAgo,
    isRecent: diffInHours < 24
  };
};

// Helper function to get notification icon based on type
export const getNotificationIcon = (type) => {
  const iconMap = {
    appointment_reminder: '📅',
    appointment_confirmed: '✅',
    appointment_cancelled: '❌',
    appointment_rescheduled: '🔄',
    payment_received: '💳',
    payment_failed: '❌',
    system_update: '🔔',
    welcome: '👋',
    doctor_message: '👨‍⚕️',
    prescription_ready: '💊',
    test_results: '🔬',
    general: '📢',
    default: '🔔'
  };

  return iconMap[type] || iconMap.default;
};

export default notificationService;