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
    private String companyName;
    private Long jobCount;
    private Integer rank;
    private String avatar;
}
