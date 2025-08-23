package com.jobportal.service;

import com.jobportal.dto.JobDescriptionRequest;
import com.jobportal.dto.JobDescriptionResponse;

public interface JobDescriptionAIService {
    
    /**
     * Generates job description based on provided data
     * @param request data for description generation
     * @return generated description with additional information
     */
    JobDescriptionResponse generateJobDescription(JobDescriptionRequest request);
    
    /**
     * Optimizes existing job description for better search
     * @param description original description
     * @return optimized description
     */
    String optimizeDescription(String description);
    
    /**
     * Validates description against standards and provides recommendations
     * @param description description to validate
     * @return improvement recommendations
     */
    String validateDescription(String description);
    
    /**
     * Generates SEO keywords for job posting
     * @param jobTitle job title
     * @param skills skills
     * @param location location
     * @return list of keywords
     */
    String generateSEOKeywords(String jobTitle, String skills, String location);
}
