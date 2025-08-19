package com.jobportal.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.jobportal.dto.NotificationDTO;
import com.jobportal.dto.NotificationStatus;
import com.jobportal.entity.Notification;
import com.jobportal.exception.JobPortalException;
import com.jobportal.repository.NotificationRepository;
import com.jobportal.utility.Utilities;

@Service("notificationService")
public class NotificationServiceImpl implements NotificationService{
	@Autowired
	private NotificationRepository notificationRepository;

    @Autowired
    private KafkaTemplate<String, NotificationDTO> kafkaTemplate;
    
    @Autowired
    private WebSocketNotificationService webSocketNotificationService;
    
    private static final String NOTIFICATION_TOPIC = "notification-events";

	@Override
	public void sendNotification(NotificationDTO notificationDTO) {
		try {
			notificationDTO.setId(Utilities.getNextSequenceId("notification"));
		} catch (JobPortalException e) {
			throw new RuntimeException("Failed to get next notification sequence", e);
		}
		notificationDTO.setStatus(NotificationStatus.UNREAD);
		notificationDTO.setTimestamp(LocalDateTime.now());
		notificationRepository.save(notificationDTO.toEntity());
		sendNotificationEvent(notificationDTO);
		// Отправляем уведомление через WebSocket в реальном времени
		webSocketNotificationService.sendNotificationToUser(notificationDTO.getUserId(), notificationDTO);
	}

	@Override
	public void sendNotificationEvent(NotificationDTO notificationDTO) {
        kafkaTemplate.send(NOTIFICATION_TOPIC, notificationDTO);
    }

    @KafkaListener(topics = "notification-events", groupId = "jobportal-group", containerFactory = "notificationKafkaListenerContainerFactory")
    public void listenNotificationEvents(NotificationDTO notificationDTO) {
        // Можно добавить логику фильтрации/обработки, если нужно
        notificationRepository.save(notificationDTO.toEntity());
    }

	@Override
	public List<Notification> getUnreadNotifications(Long userId) {
		return notificationRepository.findByUserIdAndStatus(userId, NotificationStatus.UNREAD);
	}

	@Override
	public void readNotification(Long id) throws JobPortalException {
		Notification noti=notificationRepository.findById(id).orElseThrow(()->new JobPortalException("No Notitication found"));
		noti.setStatus(NotificationStatus.READ);
		notificationRepository.save(noti);
		
	}
}
