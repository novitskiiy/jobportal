package com.jobportal.service;

import com.jobportal.dto.JobDescriptionRequest;
import com.jobportal.dto.JobDescriptionResponse;

public interface JobDescriptionAIService {
    
    /**
     * Генерирует описание вакансии на основе предоставленных данных
     * @param request данные для генерации описания
     * @return сгенерированное описание с дополнительной информацией
     */
    JobDescriptionResponse generateJobDescription(JobDescriptionRequest request);
    
    /**
     * Оптимизирует существующее описание вакансии для лучшего поиска
     * @param description исходное описание
     * @return оптимизированное описание
     */
    String optimizeDescription(String description);
    
    /**
     * Проверяет описание на соответствие стандартам и дает рекомендации
     * @param description описание для проверки
     * @return рекомендации по улучшению
     */
    String validateDescription(String description);
    
    /**
     * Генерирует SEO-ключевые слова для вакансии
     * @param jobTitle название должности
     * @param skills навыки
     * @param location местоположение
     * @return список ключевых слов
     */
    String generateSEOKeywords(String jobTitle, String skills, String location);
}
