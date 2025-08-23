import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconClock, IconUserCheck, IconLock, IconFile } from '@tabler/icons-react';

export interface StatusUpdate {
    jobId: number;
    applicantId: number;
    oldStatus: string;
    newStatus: string;
    type: string;
    message: string;
    targetUserId: number;
    
    // Данные кандидата для новых заявок
    applicantName?: string;
    applicantEmail?: string;
    applicantPhone?: number;
    applicantWebsite?: string;
    applicantResume?: string;
    applicantCoverLetter?: string;
}

class StatusUpdateService {
    private statusUpdateCallbacks: ((update: StatusUpdate) => void)[] = [];

    // Регистрируем callback для обработки обновлений статусов
    onStatusUpdate(callback: (update: StatusUpdate) => void) {
        this.statusUpdateCallbacks.push(callback);
    }

    // Удаляем callback
    removeStatusUpdateCallback(callback: (update: StatusUpdate) => void) {
        this.statusUpdateCallbacks = this.statusUpdateCallbacks.filter(cb => cb !== callback);
    }

    // Handle status update
    handleStatusUpdate(update: StatusUpdate) {
        console.log('StatusUpdateService: Processing status update:', update);
        console.log('StatusUpdateService: Number of registered callbacks:', this.statusUpdateCallbacks.length);
        
        // Notify all registered callbacks
        this.statusUpdateCallbacks.forEach(callback => {
            try {
                callback(update);
            } catch (error) {
                console.error('Error in status update callback:', error);
            }
        });

        // Show toast notification only for applications, not for job status changes
        // And only for candidates, not for employers
        if (update.type !== "JOB_STATUS" && update.targetUserId === update.applicantId) {
            this.showStatusUpdateNotification(update);
        }
    }

    // Show toast notification about status change
    private showStatusUpdateNotification(update: StatusUpdate) {
        const getStatusIcon = (status: string) => {
            switch (status) {
                case 'ACCEPTED':
                case 'OFFERED':
                    return <IconCheck size={16} />;
                case 'REJECTED':
                    return <IconX size={16} />;
                case 'INTERVIEWING':
                    return <IconClock size={16} />;
                case 'APPLIED':
                    return <IconUserCheck size={16} />;
                case 'CLOSED':
                    return <IconLock size={16} />;
                case 'ACTIVE':
                    return <IconCheck size={16} />;
                case 'DRAFT':
                    return <IconFile size={16} />;
                default:
                    return <IconUserCheck size={16} />;
            }
        };

        const getStatusColor = (status: string) => {
            switch (status) {
                case 'ACCEPTED':
                case 'OFFERED':
                    return 'green';
                case 'REJECTED':
                    return 'red';
                case 'INTERVIEWING':
                    return 'blue';
                case 'APPLIED':
                    return 'blue';
                case 'CLOSED':
                    return 'red';
                case 'ACTIVE':
                    return 'green';
                case 'DRAFT':
                    return 'gray';
                default:
                    return 'gray';
            }
        };

        const getStatusMessage = (oldStatus: string, newStatus: string, type: string) => {
            if (type === "NEW_APPLICATION") {
                // Убираем уведомление "Новая заявка получена" для работодателей
                return null;
            }
            
            if (type === "JOB_STATUS") {
                switch (newStatus) {
                    case 'CLOSED':
                        return 'Вакансия была закрыта';
                    case 'ACTIVE':
                        return 'Вакансия была активирована';
                    case 'DRAFT':
                        return 'Вакансия была сохранена как черновик';
                    default:
                        return update.message;
                }
            }
            
            switch (newStatus) {
                case 'INTERVIEWING':
                    // Убираем уведомление "Вас пригласили на собеседование!" так как есть отдельное уведомление "Interview Scheduled"
                    return null;
                case 'OFFERED':
                    // Убираем уведомление "Вам предложили работу!" так как есть отдельное уведомление "Application Accepted"
                    return null;
                case 'ACCEPTED':
                    return 'Вы приняли предложение о работе!';
                case 'REJECTED':
                    // Убираем уведомление "К сожалению, ваша заявка была отклонена" так как есть отдельное уведомление "Application Rejected"
                    return null;
                case 'APPLIED':
                    return 'Заявка подана успешно!';
                default:
                    return update.message;
            }
        };

        const getNotificationTitle = (type: string, oldStatus: string, newStatus: string) => {
            if (type === "NEW_APPLICATION") {
                return 'Новая заявка';
            }
            return `Статус обновлен: ${oldStatus} → ${newStatus}`;
        };

        const message = getStatusMessage(update.oldStatus, update.newStatus, update.type);
        
        // Не показываем уведомление если сообщение равно null
        if (message === null) {
            return;
        }

        notifications.show({
            id: `status-update-${update.jobId}-${update.applicantId}`,
            title: getNotificationTitle(update.type, update.oldStatus, update.newStatus),
            message: message,
            icon: getStatusIcon(update.newStatus),
            color: getStatusColor(update.newStatus),
            autoClose: 5000,
            withCloseButton: true,
        });
    }
}

export default new StatusUpdateService();
