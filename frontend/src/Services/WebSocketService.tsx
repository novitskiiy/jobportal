import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import StatusUpdateService, { StatusUpdate } from './StatusUpdateService';

class WebSocketService {
    private client: Client | null = null;
    private isConnected = false;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    connect(userId: string, onNotificationReceived: (notification: any) => void) {
        if (this.client && this.isConnected) {
            return;
        }

        this.client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws', null, {
                timeout: 5000,
                transports: ['websocket', 'xhr-streaming', 'xhr-polling']
            }),
            debug: (str) => {
                console.log('STOMP: ' + str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            connectionTimeout: 10000,
        });

        this.client.onConnect = () => {
            console.log('WebSocketService: WebSocket connected');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            
            // Subscribe to user's personal notifications
            this.client?.subscribe(`/user/${userId}/queue/notifications`, (message) => {
                try {
                    const notification = JSON.parse(message.body);
                    onNotificationReceived(notification);
                } catch (error) {
                    console.error('Error parsing notification:', error);
                }
            });

            // Subscribe to status updates
            console.log(`WebSocketService: Subscribing to status updates for user ${userId}`);
            this.client?.subscribe(`/user/${userId}/queue/status-updates`, (message) => {
                try {
                    const statusUpdate: StatusUpdate = JSON.parse(message.body);
                    console.log('WebSocketService: Received status update:', statusUpdate);
                    if (statusUpdate.type === "NEW_APPLICATION") {
                        console.log('WebSocketService: New candidate data:', {
                            name: statusUpdate.applicantName,
                            email: statusUpdate.applicantEmail,
                            phone: statusUpdate.applicantPhone,
                            website: statusUpdate.applicantWebsite
                        });
                    }
                    StatusUpdateService.handleStatusUpdate(statusUpdate);
                } catch (error) {
                    console.error('Error parsing status update:', error);
                }
            });
        };

        this.client.onDisconnect = () => {
            console.log('WebSocket disconnected');
            this.isConnected = false;
        };

        this.client.onStompError = (frame) => {
            console.error('STOMP error:', frame);
            this.isConnected = false;
        };

        this.client.onWebSocketError = (error) => {
            console.error('WebSocket error:', error);
            this.isConnected = false;
        };

        this.client.onWebSocketClose = () => {
            console.log('WebSocket connection closed');
            this.isConnected = false;
        };

        this.client.activate();
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            this.isConnected = false;
        }
    }

    isConnectedStatus() {
        return this.isConnected;
    }
}

export default new WebSocketService();
