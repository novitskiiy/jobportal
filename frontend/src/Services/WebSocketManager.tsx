import WebSocketService from './WebSocketService';

class WebSocketManager {
    private currentUserId: string | null = null;
    private notificationCallback: ((notification: any) => void) | null = null;

    connect(userId: string, onNotificationReceived: (notification: any) => void) {
        console.log(`WebSocketManager: Попытка подключения для пользователя ${userId}`);
        
        if (this.currentUserId === userId && WebSocketService.isConnectedStatus()) {
            console.log(`WebSocketManager: Уже подключены к пользователю ${userId}`);
            return; // Уже подключены к этому пользователю
        }

        // Отключаем предыдущее подключение
        this.disconnect();

        this.currentUserId = userId;
        this.notificationCallback = onNotificationReceived;

        console.log(`WebSocketManager: Подключаемся к WebSocket для пользователя ${userId}`);
        WebSocketService.connect(userId, (notification) => {
            console.log(`WebSocketManager: Получено уведомление:`, notification);
            if (this.notificationCallback) {
                this.notificationCallback(notification);
            }
        });
    }

    disconnect() {
        WebSocketService.disconnect();
        this.currentUserId = null;
        this.notificationCallback = null;
    }

    isConnected() {
        return WebSocketService.isConnectedStatus();
    }

    getCurrentUserId() {
        return this.currentUserId;
    }
}

export default new WebSocketManager();
