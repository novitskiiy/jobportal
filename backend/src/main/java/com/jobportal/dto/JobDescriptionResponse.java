package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
}
