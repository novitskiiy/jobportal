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
    
    // Новые поля для более гибкой генерации
    private String descriptionStyle; // "detailed", "concise", "creative", "technical", "marketing"
    private String targetAudience; // "junior", "mid", "senior", "all"
    private String industry; // "tech", "finance", "healthcare", "education", "retail", etc.
    private String companySize; // "startup", "small", "medium", "large", "enterprise"
    private String workMode; // "remote", "hybrid", "onsite"
    private List<String> benefits; // ["health insurance", "flexible hours", "learning budget"]
    private String aboutJob; // Краткое описание для поля "About Job"
    private Boolean includeCompanyInfo; // Включать ли информацию о компании
    private Boolean includeBenefits; // Включать ли раздел с бенефитами
    private Boolean includeGrowthOpportunities; // Включать ли возможности роста
    private String customInstructions; // Пользовательские инструкции для AI
}
