package com.jobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.jobportal.dto.NotificationDTO;
import com.jobportal.dto.StatusUpdateDTO;

@Service
public class WebSocketNotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    public WebSocketNotificationService() {
        System.out.println("WebSocketNotificationService: Сервис создан");
    }

    public void sendNotificationToUser(Long userId, NotificationDTO notification) {
        System.out.println("WebSocketNotificationService: Отправляем уведомление пользователю " + userId);
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/notifications",
            notification
        );
    }

    public void sendNotificationToAll(NotificationDTO notification) {
        messagingTemplate.convertAndSend("/topic/notifications", notification);
    }

    public void sendStatusUpdateToUser(Long userId, StatusUpdateDTO statusUpdate) {
        System.out.println("WebSocketNotificationService: Отправляем статус обновление пользователю " + userId + " с типом " + statusUpdate.getType());
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/status-updates",
            statusUpdate
        );
    }

    public void sendStatusUpdateToAll(StatusUpdateDTO statusUpdate) {
        messagingTemplate.convertAndSend("/topic/status-updates", statusUpdate);
    }
}
