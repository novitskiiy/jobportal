import React from "react";
import { notifications } from "@mantine/notifications";
import { IconBell } from "@tabler/icons-react";

interface NotificationToastProps {
    notification: any;
}

const NotificationToast = ({ notification }: NotificationToastProps) => {
    const showNotification = () => {
        notifications.show({
            id: `notification-${notification.id}`,
            title: notification.action,
            message: notification.message,
            icon: <IconBell size={16} />,
            color: "blue",
            autoClose: 5000,
            withCloseButton: true,
            onClick: () => {
                // Можно добавить навигацию к уведомлению
                console.log('Notification clicked:', notification);
            }
        });
    };

    // Автоматически показываем уведомление при получении
    React.useEffect(() => {
        showNotification();
    }, [notification]);

    return null; // Этот компонент не рендерит ничего видимого
};

export default NotificationToast;
