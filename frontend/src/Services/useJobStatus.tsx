import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import StatusUpdateService, { StatusUpdate } from './StatusUpdateService';

export const useJobStatus = (jobId?: number, applicantId?: number) => {
    const user = useSelector((state: any) => state.user);
    const [jobStatus, setJobStatus] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    // Обработчик обновления статуса
    const handleStatusUpdate = useCallback((update: StatusUpdate) => {
        // Проверяем, относится ли обновление к текущей заявке
        if (jobId && update.jobId === jobId) {
            if (applicantId && update.applicantId === applicantId) {
                // Обновление для конкретного соискателя
                setJobStatus(update.newStatus);
            } else if (!applicantId) {
                // Обновление для работодателя (все соискатели)
                setJobStatus(update.newStatus);
            }
        }
    }, [jobId, applicantId]);

    // Регистрируем обработчик обновлений статусов
    useEffect(() => {
        StatusUpdateService.onStatusUpdate(handleStatusUpdate);

        return () => {
            StatusUpdateService.removeStatusUpdateCallback(handleStatusUpdate);
        };
    }, [handleStatusUpdate]);

    // Обновляем статус заявки
    const updateJobStatus = useCallback((newStatus: string) => {
        setJobStatus(newStatus);
    }, []);

    return {
        jobStatus,
        isLoading,
        updateJobStatus
    };
};
