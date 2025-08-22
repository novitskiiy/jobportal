package com.jobportal.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.dto.JobDescriptionRequest;
import com.jobportal.dto.JobDescriptionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobDescriptionAIServiceImpl implements JobDescriptionAIService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String openAiApiKey;
    private final String openAiBaseUrl;
    private final String ollamaBaseUrl;
    private final String ollamaChatModel;

    @Override
    public JobDescriptionResponse generateJobDescription(JobDescriptionRequest request) {
        try {
            log.info("Generating job description for: {}", request.getJobTitle());
            
            String prompt = buildGenerationPrompt(request);
            String response;
            
            if (openAiApiKey != null && !openAiApiKey.isEmpty()) {
                response = callOpenAI(prompt);
            } else {
                response = callOllama(prompt);
            }
            
            // Parse AI response
            JobDescriptionResponse result = parseGenerationResponse(response);
            result.setTone(request.getTone() != null ? request.getTone() : "professional");
            result.setLanguage(request.getLanguage() != null ? request.getLanguage() : "en");
            
            log.info("Successfully generated job description for: {}", request.getJobTitle());
            return result;
            
        } catch (Exception e) {
            log.error("Error generating job description for: {}", request.getJobTitle(), e);
            return createFallbackResponse(request);
        }
    }

    @Override
    public String optimizeDescription(String description) {
        try {
            String prompt = String.format("""
                Optimize the following job description for better search results and candidate attraction.
                Make the text more appealing, clear, and well-structured.
                
                Original description:
                %s
                
                Return only the optimized description without additional comments.
                """, description);

            if (openAiApiKey != null && !openAiApiKey.isEmpty()) {
                return callOpenAI(prompt);
            } else {
                return callOllama(prompt);
            }
            
        } catch (Exception e) {
            log.error("Error optimizing description", e);
            return description; // Return original description in case of error
        }
    }

    @Override
    public String validateDescription(String description) {
        try {
            String prompt = String.format("""
                Analyze the following job description and provide improvement recommendations.
                Check for compliance with HR and marketing standards.
                
                Description:
                %s
                
                Provide specific recommendations for:
                1. Structure and readability
                2. Appeal to candidates
                3. Standards compliance
                4. SEO optimization
                5. Legal aspects
                
                Be constructive and provide actionable advice.
                """, description);

            if (openAiApiKey != null && !openAiApiKey.isEmpty()) {
                return callOpenAI(prompt);
            } else {
                return callOllama(prompt);
            }
            
        } catch (Exception e) {
            log.error("Error validating description", e);
            return "Unable to validate description. Please check the text manually.";
        }
    }

    @Override
    public String generateSEOKeywords(String jobTitle, String skills, String location) {
        try {
            String prompt = String.format("""
                Generate SEO keywords for a job posting based on the following data.
                Return only a comma-separated list of keywords, without additional text.
                
                Position: %s
                Skills: %s
                Location: %s
                
                Include:
                - Job title and synonyms
                - Technologies and skills
                - Location and remote work
                - Experience level
                - Employment type
                """, jobTitle, skills, location);

            if (openAiApiKey != null && !openAiApiKey.isEmpty()) {
                return callOpenAI(prompt);
            } else {
                return callOllama(prompt);
            }
            
        } catch (Exception e) {
            log.error("Error generating SEO keywords", e);
            return jobTitle + ", " + skills + ", " + location;
        }
    }

    private String buildGenerationPrompt(JobDescriptionRequest request) {
        String tone = getToneDescription(request.getTone());
        String language = request.getLanguage() != null ? request.getLanguage() : "en";
        
        return String.format("""
            Create a professional and attractive job description in %s.
            
            TONE: %s
            
            JOB INFORMATION:
            - Position: %s
            - Company: %s
            - Location: %s
            - Employment Type: %s
            - Required Experience: %s
            - Salary: %s
            - Required Skills: %s
            - Additional Requirements: %s
            
            DESCRIPTION STRUCTURE:
            1. Brief introduction about the company and role
            2. Main responsibilities (5-7 points)
            3. Candidate requirements
            4. What we offer (benefits, growth opportunities)
            5. Call to action
            
            Return the description in the following JSON format:
            {
              "description": "Complete job description",
              "optimizedDescription": "Optimized version for search",
              "seoKeywords": "key, words, for, search",
              "suggestions": "Improvement recommendations",
              "qualityScore": 85.5
            }
            
            Make the description appealing to candidates while maintaining professionalism.
            """, 
            language.equals("en") ? "English" : "Russian",
            tone,
            request.getJobTitle(),
            request.getCompany() != null ? request.getCompany() : "Our company",
            request.getLocation() != null ? request.getLocation() : "Remote",
            request.getJobType() != null ? request.getJobType() : "Full-time",
            request.getExperience() != null ? request.getExperience() : "Work experience",
            request.getPackageOffered() != null ? "$" + request.getPackageOffered() + "K" : "Competitive salary",
            request.getSkillsRequired() != null ? String.join(", ", request.getSkillsRequired()) : "Not specified",
            request.getAdditionalRequirements() != null ? request.getAdditionalRequirements() : "Not specified"
        );
    }

    private String getToneDescription(String tone) {
        if (tone == null) return "professional";
        
        return switch (tone.toLowerCase()) {
            case "casual" -> "informal, friendly";
            case "friendly" -> "friendly, open";
            case "formal" -> "formal, official";
            default -> "professional, but approachable";
        };
    }

    private JobDescriptionResponse parseGenerationResponse(String response) {
        try {
            // Simple JSON response parsing
            JobDescriptionResponse result = new JobDescriptionResponse();
            
            String[] lines = response.split("\n");
            for (String line : lines) {
                if (line.contains("\"description\"")) {
                    String desc = extractJsonValue(line);
                    result.setDescription(desc);
                } else if (line.contains("\"optimizedDescription\"")) {
                    String optDesc = extractJsonValue(line);
                    result.setOptimizedDescription(optDesc);
                } else if (line.contains("\"seoKeywords\"")) {
                    String keywords = extractJsonValue(line);
                    result.setSeoKeywords(keywords);
                } else if (line.contains("\"suggestions\"")) {
                    String suggestions = extractJsonValue(line);
                    result.setSuggestions(suggestions);
                } else if (line.contains("\"qualityScore\"")) {
                    String scoreStr = extractJsonValue(line);
                    try {
                        result.setQualityScore(Double.parseDouble(scoreStr));
                    } catch (NumberFormatException e) {
                        result.setQualityScore(75.0);
                    }
                }
            }
            
            // If parsing failed, use the entire response as description
            if (result.getDescription() == null || result.getDescription().isEmpty()) {
                result.setDescription(response);
                result.setOptimizedDescription(response);
                result.setQualityScore(75.0);
            }
            
            return result;
            
        } catch (Exception e) {
            log.error("Error parsing AI response", e);
            return new JobDescriptionResponse(response, response, "", "", 75.0, "professional", "en");
        }
    }

    private String extractJsonValue(String line) {
        try {
            int startIndex = line.indexOf(":") + 1;
            String value = line.substring(startIndex).trim();
            value = value.replaceAll("^\"|\",?$", ""); // Remove quotes and commas
            return value;
        } catch (Exception e) {
            return "";
        }
    }

    private String callOpenAI(String prompt) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", List.of(Map.of("role", "user", "content", prompt)));
        requestBody.put("max_tokens", 2000);
        requestBody.put("temperature", 0.7);
        
        return webClient.post()
                .uri(openAiBaseUrl + "/v1/chat/completions")
                .header("Authorization", "Bearer " + openAiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(response -> response.get("choices").get(0).get("message").get("content").asText())
                .block();
    }
    
    private String callOllama(String prompt) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", ollamaChatModel);
        requestBody.put("prompt", prompt);
        requestBody.put("stream", false);
        
        return webClient.post()
                .uri(ollamaBaseUrl + "/api/generate")
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(response -> response.get("response").asText())
                .block();
    }
    
    private JobDescriptionResponse createFallbackResponse(JobDescriptionRequest request) {
        String fallbackDescription = String.format("""
            %s
            
            We are looking for a talented professional for the position of %s.
            
            Requirements:
            - Work experience: %s
            - Skills: %s
            - %s
            
            We offer:
            - Competitive salary
            - Growth opportunities
            - Modern technologies
            - Friendly team
            
            Send us your resume!
            """,
            request.getCompany() != null ? request.getCompany() : "Our company",
            request.getJobTitle(),
            request.getExperience() != null ? request.getExperience() : "1+ years",
            request.getSkillsRequired() != null ? String.join(", ", request.getSkillsRequired()) : "relevant skills",
            request.getAdditionalRequirements() != null ? request.getAdditionalRequirements() : "Willingness to learn"
        );
        
        return new JobDescriptionResponse(
            fallbackDescription,
            fallbackDescription,
            request.getJobTitle() + ", " + (request.getSkillsRequired() != null ? String.join(", ", request.getSkillsRequired()) : ""),
            "Please review and complete the description manually",
            60.0,
            "professional",
            "en"
        );
    }
}
