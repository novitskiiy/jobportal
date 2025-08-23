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
    private final String huggingFaceApiKey;
    private final String huggingFaceBaseUrl;
    private final String huggingFaceModel;

    @Override
    public JobDescriptionResponse generateJobDescription(JobDescriptionRequest request) {
        try {
            log.info("Generating job description for: {}", request.getJobTitle());
            
            String prompt = buildGenerationPrompt(request);
            String response;
            
            if (openAiApiKey != null && !openAiApiKey.isEmpty()) {
                response = callOpenAI(prompt);
            } else if (huggingFaceApiKey != null && !huggingFaceApiKey.isEmpty()) {
                response = callHuggingFace(prompt);
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
        String style = getStyleDescription(request.getDescriptionStyle());
        String audience = getAudienceDescription(request.getTargetAudience());
        String industry = getIndustryDescription(request.getIndustry());
        String companySize = getCompanySizeDescription(request.getCompanySize());
        String workMode = getWorkModeDescription(request.getWorkMode());
        
        StringBuilder prompt = new StringBuilder();
        prompt.append(String.format("""
            Create a %s job description in %s.
            
            TONE: %s
            STYLE: %s
            TARGET AUDIENCE: %s
            INDUSTRY: %s
            COMPANY SIZE: %s
            WORK MODE: %s
            
            JOB INFORMATION:
            - Position: %s
            - Company: %s
            - Location: %s
            - Employment Type: %s
            - Required Experience: %s
            - Salary: %s
            - Required Skills: %s
            - Additional Requirements: %s
            """,
            style,
            language.equals("en") ? "English" : "Russian",
            tone,
            style,
            audience,
            industry,
            companySize,
            workMode,
            request.getJobTitle(),
            request.getCompany() != null ? request.getCompany() : "Our company",
            request.getLocation() != null ? request.getLocation() : "Remote",
            request.getJobType() != null ? request.getJobType() : "Full-time",
            request.getExperience() != null ? request.getExperience() : "Work experience",
            request.getPackageOffered() != null ? "$" + request.getPackageOffered() + "K" : "Competitive salary",
            request.getSkillsRequired() != null ? String.join(", ", request.getSkillsRequired()) : "Not specified",
            request.getAdditionalRequirements() != null ? request.getAdditionalRequirements() : "Not specified"
        ));
        
        // Добавляем бенефиты если указаны
        if (request.getBenefits() != null && !request.getBenefits().isEmpty()) {
            prompt.append("\n- Benefits: ").append(String.join(", ", request.getBenefits()));
        }
        
        // Добавляем пользовательские инструкции
        if (request.getCustomInstructions() != null && !request.getCustomInstructions().isEmpty()) {
            prompt.append("\n\nCUSTOM INSTRUCTIONS: ").append(request.getCustomInstructions());
        }
        
        prompt.append("""
            
                         DESCRIPTION STRUCTURE:
             1. About Job (brief 2-3 sentence summary)
             2. Company information (if requested)
             3. Main responsibilities (5-8 points) - Make these highly specific to the role, skills, and experience level
             4. Candidate requirements and qualifications
             5. Benefits and perks (if requested) - Tailor to company size, industry, and salary level
             6. Growth opportunities (if requested)
             7. Call to action - Adapt based on company type and role level
            
            Return the description in the following JSON format:
            {
              "description": "Complete job description",
              "optimizedDescription": "Optimized version for search",
              "seoKeywords": "key, words, for, search",
              "suggestions": "Improvement recommendations",
              "qualityScore": 85.5,
              "aboutJob": "Brief 2-3 sentence summary for About Job field",
              "responsibilities": "Detailed responsibilities section",
              "requirements": "Detailed requirements section",
              "benefits": "Benefits and perks section",
              "companyInfo": "Company information section",
              "keyHighlights": ["highlight1", "highlight2", "highlight3"],
              "callToAction": "Engaging call to action",
              "estimatedReadTime": "3-4 minutes",
              "complexityLevel": "Intermediate",
              "alternativeTitles": ["alt1", "alt2", "alt3"],
              "summary": "Brief summary of the position"
            }
            
                         Make the description appealing to candidates while maintaining professionalism.
             Ensure the aboutJob field is concise and engaging.
             
             IMPORTANT GUIDELINES:
             - Responsibilities should be specific to the actual skills, technologies, and experience level mentioned
             - For junior roles: focus on learning, collaboration, and basic development tasks
             - For senior roles: emphasize leadership, architecture, mentoring, and strategic thinking
             - For lead roles: highlight team management, technical strategy, and business impact
             - Benefits should match the company size, industry, and salary level
             - Call to action should reflect the company culture and role seniority
             - Use industry-specific terminology and best practices
             - Make each description unique and tailored to the specific role
            """);
        
        return prompt.toString();
    }

    private String getToneDescription(String tone) {
        if (tone == null) return "professional";
        
        return switch (tone.toLowerCase()) {
            case "casual" -> "informal, friendly";
            case "friendly" -> "friendly, open";
            case "formal" -> "formal, official";
            case "creative" -> "creative, innovative";
            case "technical" -> "technical, precise";
            default -> "professional, but approachable";
        };
    }

    private String getStyleDescription(String style) {
        if (style == null) return "professional and attractive";
        
        return switch (style.toLowerCase()) {
            case "detailed" -> "detailed and comprehensive";
            case "concise" -> "concise and to-the-point";
            case "creative" -> "creative and engaging";
            case "technical" -> "technical and precise";
            case "marketing" -> "marketing-oriented and persuasive";
            default -> "professional and attractive";
        };
    }

    private String getAudienceDescription(String audience) {
        if (audience == null) return "all levels";
        
        return switch (audience.toLowerCase()) {
            case "junior" -> "junior developers and entry-level candidates";
            case "mid" -> "mid-level professionals with 2-5 years experience";
            case "senior" -> "senior professionals with 5+ years experience";
            case "all" -> "candidates of all experience levels";
            default -> "all levels";
        };
    }

    private String getIndustryDescription(String industry) {
        if (industry == null) return "technology";
        
        return switch (industry.toLowerCase()) {
            case "tech" -> "technology and software development";
            case "finance" -> "financial services and fintech";
            case "healthcare" -> "healthcare and medical technology";
            case "education" -> "education and edtech";
            case "retail" -> "retail and e-commerce";
            case "manufacturing" -> "manufacturing and industrial";
            case "consulting" -> "consulting and professional services";
            default -> "technology";
        };
    }

    private String getCompanySizeDescription(String companySize) {
        if (companySize == null) return "medium-sized company";
        
        return switch (companySize.toLowerCase()) {
            case "startup" -> "fast-growing startup";
            case "small" -> "small company (10-50 employees)";
            case "medium" -> "medium-sized company (50-500 employees)";
            case "large" -> "large company (500+ employees)";
            case "enterprise" -> "enterprise-level company";
            default -> "medium-sized company";
        };
    }

    private String getWorkModeDescription(String workMode) {
        if (workMode == null) return "flexible work arrangement";
        
        return switch (workMode.toLowerCase()) {
            case "remote" -> "fully remote work";
            case "hybrid" -> "hybrid work model";
            case "onsite" -> "on-site work";
            default -> "flexible work arrangement";
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
                } else if (line.contains("\"aboutJob\"")) {
                    String aboutJob = extractJsonValue(line);
                    result.setAboutJob(aboutJob);
                } else if (line.contains("\"responsibilities\"")) {
                    String responsibilities = extractJsonValue(line);
                    result.setResponsibilities(responsibilities);
                } else if (line.contains("\"requirements\"")) {
                    String requirements = extractJsonValue(line);
                    result.setRequirements(requirements);
                } else if (line.contains("\"benefits\"")) {
                    String benefits = extractJsonValue(line);
                    result.setBenefits(benefits);
                } else if (line.contains("\"companyInfo\"")) {
                    String companyInfo = extractJsonValue(line);
                    result.setCompanyInfo(companyInfo);
                } else if (line.contains("\"callToAction\"")) {
                    String callToAction = extractJsonValue(line);
                    result.setCallToAction(callToAction);
                } else if (line.contains("\"estimatedReadTime\"")) {
                    String readTime = extractJsonValue(line);
                    result.setEstimatedReadTime(readTime);
                } else if (line.contains("\"complexityLevel\"")) {
                    String complexity = extractJsonValue(line);
                    result.setComplexityLevel(complexity);
                } else if (line.contains("\"summary\"")) {
                    String summary = extractJsonValue(line);
                    result.setSummary(summary);
                }
            }
            
            // If parsing failed, use the entire response as description
            if (result.getDescription() == null || result.getDescription().isEmpty()) {
                result.setDescription(response);
                result.setOptimizedDescription(response);
                result.setQualityScore(75.0);
            }
            
            // Set default values for missing fields
            if (result.getAboutJob() == null || result.getAboutJob().isEmpty()) {
                result.setAboutJob("Join our team and contribute to exciting projects in a dynamic environment.");
            }
            
            return result;
            
        } catch (Exception e) {
            log.error("Error parsing AI response", e);
            JobDescriptionResponse fallback = new JobDescriptionResponse();
            fallback.setDescription(response);
            fallback.setOptimizedDescription(response);
            fallback.setSeoKeywords("");
            fallback.setSuggestions("");
            fallback.setQualityScore(75.0);
            fallback.setTone("professional");
            fallback.setLanguage("en");
            return fallback;
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

    private String callHuggingFace(String prompt) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("inputs", prompt);
        requestBody.put("parameters", Map.of(
            "max_new_tokens", 500,
            "temperature", 0.7,
            "do_sample", true
        ));
        
        return webClient.post()
                .uri(huggingFaceBaseUrl + "/models/" + huggingFaceModel)
                .header("Authorization", "Bearer " + huggingFaceApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(response -> {
                    if (response.isArray() && response.size() > 0) {
                        return response.get(0).get("generated_text").asText();
                    }
                    return response.asText();
                })
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
        
        String aboutJob = String.format("Join our team as a %s and contribute to exciting projects in a dynamic environment.", 
            request.getJobTitle());
        
        JobDescriptionResponse fallback = new JobDescriptionResponse();
        fallback.setDescription(fallbackDescription);
        fallback.setOptimizedDescription(fallbackDescription);
        fallback.setSeoKeywords(request.getJobTitle() + ", " + (request.getSkillsRequired() != null ? String.join(", ", request.getSkillsRequired()) : ""));
        fallback.setSuggestions("Please review and complete the description manually");
        fallback.setQualityScore(60.0);
        fallback.setTone("professional");
        fallback.setLanguage("en");
        fallback.setAboutJob(aboutJob);
        // Generate dynamic responsibilities based on experience level
        String responsibilities;
        if (request.getExperience() != null && request.getExperience().toLowerCase().contains("junior")) {
            responsibilities = "• Learn and understand the existing codebase and development processes\n• Write clean, maintainable code following best practices\n• Participate in code reviews and team meetings\n• Collaborate with senior developers on feature implementation";
        } else if (request.getExperience() != null && request.getExperience().toLowerCase().contains("senior")) {
            responsibilities = "• Lead technical design and architecture decisions\n• Mentor and guide junior and middle developers\n• Drive best practices and coding standards across the team\n• Collaborate with product managers on feature planning";
        } else {
            responsibilities = "• Design and implement new features and improvements\n• Write clean, scalable, and maintainable code\n• Participate in architectural decisions and technical discussions\n• Mentor junior developers and conduct code reviews";
        }
        fallback.setResponsibilities(responsibilities);
        // Generate dynamic requirements based on skills
        String requirements = "• Experience with relevant technologies\n• Strong problem-solving skills\n• Excellent communication abilities";
        if (request.getSkillsRequired() != null && !request.getSkillsRequired().isEmpty()) {
            requirements += "\n• Proficiency in " + String.join(", ", request.getSkillsRequired());
        }
        fallback.setRequirements(requirements);
        
        // Generate dynamic benefits based on company and salary
        String benefits = "• Competitive salary";
        if (request.getPackageOffered() != null && request.getPackageOffered() > 100) {
            benefits += "\n• Performance bonuses and incentives";
        }
        benefits += "\n• Health insurance\n• Flexible work hours";
        if (request.getJobType() != null && request.getJobType().toLowerCase().contains("remote")) {
            benefits += "\n• Remote work options";
        }
        fallback.setBenefits(benefits);
        fallback.setCompanyInfo("We are a dynamic company focused on innovation and growth.");
        fallback.setKeyHighlights(List.of("Exciting projects", "Professional growth", "Competitive benefits"));
        fallback.setCallToAction("Apply now to join our team!");
        fallback.setEstimatedReadTime("3-4 minutes");
        fallback.setComplexityLevel("Intermediate");
        fallback.setAlternativeTitles(List.of(request.getJobTitle()));
        fallback.setSummary("Join our team and make a difference");
        return fallback;
    }
}
