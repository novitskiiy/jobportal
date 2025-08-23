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
    private String tone; // "professional", "casual", "friendly", "formal", "creative", "technical"
    private String language; // "ru", "en"
    
    // New fields for more flexible generation
    private String descriptionStyle; // "detailed", "concise", "creative", "technical", "marketing"
    private String targetAudience; // "junior", "mid", "senior", "all"
    private String industry; // "tech", "finance", "healthcare", "education", "retail", etc.
    private String companySize; // "startup", "small", "medium", "large", "enterprise"
    private String workMode; // "remote", "hybrid", "onsite"
    private List<String> benefits; // ["health insurance", "flexible hours", "learning budget"]
    private String aboutJob; // Brief description for "About Job" field
    private Boolean includeCompanyInfo; // Whether to include company information
    private Boolean includeBenefits; // Whether to include benefits section
    private Boolean includeGrowthOpportunities; // Whether to include growth opportunities
    private String customInstructions; // Custom instructions for AI
}
