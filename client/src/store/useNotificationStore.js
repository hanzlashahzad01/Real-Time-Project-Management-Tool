import { create } from 'zustand';
import api from '../services/api';
import socketService from '../services/socket';

const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,

    fetchNotifications: async () => {
        set({ loading: true });
        try {
            const res = await api.get('/notifications');
            const notifications = res.data;
            set({
                notifications,
                unreadCount: notifications.filter(n => !n.read).length
            });
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            set({ loading: false });
        }
    },

    markAsRead: async (notificationId) => {
        try {
            await api.put(`/notifications/${notificationId}/read`);
            set(state => {
                const notifications = state.notifications.map(n =>
                    n._id === notificationId ? { ...n, read: true } : n
                );
                return {
                    notifications,
                    unreadCount: notifications.filter(n => !n.read).length
                };
            });
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    },

    markAllAsRead: async () => {
        try {
            await api.put('/notifications/read-all');
            set(state => ({
                notifications: state.notifications.map(n => ({ ...n, read: true })),
                unreadCount: 0
            }));
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    },

    addNotification: (notification) => {
        set(state => {
            const notifications = [notification, ...state.notifications];
            return {
                notifications,
                unreadCount: notifications.filter(n => !n.read).length
            };
        });
    },

    deleteNotification: async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            set(state => {
                const notifications = state.notifications.filter(n => n._id !== id);
                return {
                    notifications,
                    unreadCount: notifications.filter(n => !n.read).length
                };
            });
        } catch (err) {
            console.error('Failed to delete notification:', err);
        }
    },

    clearAll: async () => {
        try {
            await api.delete('/notifications');
            set({ notifications: [], unreadCount: 0 });
        } catch (err) {
            console.error('Failed to clear notifications:', err);
        }
    }
}));

export default useNotificationStore;
