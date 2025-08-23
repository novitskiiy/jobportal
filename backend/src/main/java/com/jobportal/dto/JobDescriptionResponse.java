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
    
    // New fields for more detailed response
    private String aboutJob; // Brief description for "About Job" field
    private String responsibilities; // Separate section with responsibilities
    private String requirements; // Separate section with requirements
    private String benefits; // Separate section with benefits
    private String companyInfo; // Company information
    private List<String> keyHighlights; // Key highlights of the job
    private String callToAction; // Call to action
    private String estimatedReadTime; // Estimated reading time
    private String complexityLevel; // Description complexity level
    private List<String> alternativeTitles; // Alternative job titles
    private String summary; // Brief job summary
}
