package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployerLeaderboardDTO {
    private String employerId;
    private String employerName;
    private Long jobCount;
    private Integer rank;
    private String avatar;
}
