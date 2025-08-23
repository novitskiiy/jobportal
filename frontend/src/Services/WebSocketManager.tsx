import WebSocketService from './WebSocketService';

class WebSocketManager {
    private currentUserId: string | null = null;
    private notificationCallback: ((notification: any) => void) | null = null;

    connect(userId: string, onNotificationReceived: (notification: any) => void) {
        console.log(`WebSocketManager: Attempting connection for user ${userId}`);
        
        if (this.currentUserId === userId && WebSocketService.isConnectedStatus()) {
            console.log(`WebSocketManager: Already connected to user ${userId}`);
            return; // Already connected to this user
        }

        // Disconnect previous connection
        this.disconnect();

        this.currentUserId = userId;
        this.notificationCallback = onNotificationReceived;

        console.log(`WebSocketManager: Connecting to WebSocket for user ${userId}`);
        WebSocketService.connect(userId, (notification) => {
            console.log(`WebSocketManager: Received notification:`, notification);
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
