import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import StatusUpdateService, { StatusUpdate } from './StatusUpdateService';

export const useJobStatus = (jobId?: number, applicantId?: number) => {
    const user = useSelector((state: any) => state.user);
    const [jobStatus, setJobStatus] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    // Status update handler
    const handleStatusUpdate = useCallback((update: StatusUpdate) => {
        // Check if the update relates to the current application
        if (jobId && update.jobId === jobId) {
            if (applicantId && update.applicantId === applicantId) {
                // Update for specific applicant
                setJobStatus(update.newStatus);
            } else if (!applicantId) {
                // Update for employer (all applicants)
                setJobStatus(update.newStatus);
            }
        }
    }, [jobId, applicantId]);

    // Register status update handler
    useEffect(() => {
        StatusUpdateService.onStatusUpdate(handleStatusUpdate);

        return () => {
            StatusUpdateService.removeStatusUpdateCallback(handleStatusUpdate);
        };
    }, [handleStatusUpdate]);

    // Update application status
    const updateJobStatus = useCallback((newStatus: string) => {
        setJobStatus(newStatus);
    }, []);

    return {
        jobStatus,
        isLoading,
        updateJobStatus
    };
};
