package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateDTO {
    private Long jobId;
    private Long applicantId;
    private String oldStatus;
    private String newStatus;
    private String type; // "APPLICATION_STATUS", "JOB_STATUS" или "NEW_APPLICATION"
    private String message;
    private Long targetUserId; // ID пользователя, которому нужно отправить обновление
    
    // Данные кандидата для новых заявок
    private String applicantName;
    private String applicantEmail;
    private Long applicantPhone;
    private String applicantWebsite;
    private String applicantResume;
    private String applicantCoverLetter;
}
