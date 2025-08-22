package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobDescriptionRequest {
    private String jobTitle;
    private List<String> skillsRequired;
    private String experience;
    private String company;
    private String location;
    private String jobType;
    private Long packageOffered;
    private String additionalRequirements;
    private String tone; // "professional", "casual", "friendly", "formal"
    private String language; // "ru", "en"
}
