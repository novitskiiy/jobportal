import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getNotifications, readNotification } from './NotiService';
import WebSocketManager from './WebSocketManager';
import { notifications } from '@mantine/notifications';
import { IconBell } from '@tabler/icons-react';

export const useNotifications = () => {
    const user = useSelector((state: any) => state.user);
    const [notificationList, setNotificationList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Load existing notifications
    const loadNotifications = useCallback(async () => {
        if (!user?.id) return;
        
        setLoading(true);
        try {
            const res = await getNotifications(user.id);
            setNotificationList(res);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // Handle new notification
    const handleNewNotification = useCallback((newNotification: any) => {
        setNotificationList(prev => [newNotification, ...prev]);
        
        // Don't show toast notification for duplicate notifications
        if (newNotification.action === "Interview Scheduled" || 
            newNotification.action === "Application Accepted" || 
            newNotification.action === "Application Rejected") {
            return;
        }
        
        // Show toast notification
        notifications.show({
            id: `notification-${newNotification.id}`,
            title: newNotification.action,
            message: newNotification.message,
            icon: <IconBell size={16} />,
            color: "blue",
            autoClose: 5000,
            withCloseButton: true,
        });
    }, []);

    // Mark notification as read
    const markAsRead = useCallback(async (notificationId: number, index: number) => {
        try {
            await readNotification(notificationId);
            setNotificationList(prev => prev.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }, []);

    // Connect to WebSocket
    useEffect(() => {
        if (!user?.id) return;

        loadNotifications();
        
        // Connect to WebSocket with delay to ensure user is loaded
        const timer = setTimeout(() => {
            console.log(`useNotifications: Connecting to WebSocket for user ${user.id}`);
            WebSocketManager.connect(user.id.toString(), handleNewNotification);
        }, 1000);

        return () => {
            clearTimeout(timer);
            // Don't disconnect WebSocket here as it may be used by other components
        };
    }, [user?.id, loadNotifications, handleNewNotification]);

    return {
        notifications: notificationList,
        loading,
        markAsRead,
        refreshNotifications: loadNotifications
    };
};
