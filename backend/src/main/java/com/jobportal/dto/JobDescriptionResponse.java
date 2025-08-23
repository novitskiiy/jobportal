package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobDescriptionResponse {
    private String description;
    private String optimizedDescription;
    private String seoKeywords;
    private String suggestions;
    private double qualityScore;
    private String tone;
    private String language;
    
    // Новые поля для более детального ответа
    private String aboutJob; // Краткое описание для поля "About Job"
    private String responsibilities; // Отдельный раздел с обязанностями
    private String requirements; // Отдельный раздел с требованиями
    private String benefits; // Отдельный раздел с бенефитами
    private String companyInfo; // Информация о компании
    private List<String> keyHighlights; // Ключевые моменты вакансии
    private String callToAction; // Призыв к действию
    private String estimatedReadTime; // Примерное время чтения
    private String complexityLevel; // Уровень сложности описания
    private List<String> alternativeTitles; // Альтернативные названия должности
    private String summary; // Краткое резюме вакансии
}
