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

    // Загрузка существующих уведомлений
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

    // Обработка нового уведомления
    const handleNewNotification = useCallback((newNotification: any) => {
        setNotificationList(prev => [newNotification, ...prev]);
        
        // Не показываем toast уведомление для дублирующихся уведомлений
        if (newNotification.action === "Interview Scheduled" || 
            newNotification.action === "Application Accepted" || 
            newNotification.action === "Application Rejected") {
            return;
        }
        
        // Показываем toast уведомление
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

    // Отметить уведомление как прочитанное
    const markAsRead = useCallback(async (notificationId: number, index: number) => {
        try {
            await readNotification(notificationId);
            setNotificationList(prev => prev.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }, []);

    // Подключение к WebSocket
    useEffect(() => {
        if (!user?.id) return;

        loadNotifications();
        
        // Подключаемся к WebSocket с задержкой, чтобы убедиться, что пользователь загружен
        const timer = setTimeout(() => {
            console.log(`useNotifications: Подключаемся к WebSocket для пользователя ${user.id}`);
            WebSocketManager.connect(user.id.toString(), handleNewNotification);
        }, 1000);

        return () => {
            clearTimeout(timer);
            // Не отключаем WebSocket здесь, так как он может использоваться другими компонентами
        };
    }, [user?.id, loadNotifications, handleNewNotification]);

    return {
        notifications: notificationList,
        loading,
        markAsRead,
        refreshNotifications: loadNotifications
    };
};
