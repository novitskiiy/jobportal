package com.jobportal.api;

import com.jobportal.dto.JobDescriptionRequest;
import com.jobportal.dto.JobDescriptionResponse;
import com.jobportal.dto.ResponseDTO;
import com.jobportal.service.JobDescriptionAIService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/ai/job-description")
@RequiredArgsConstructor
@Slf4j
public class JobDescriptionAIAPI {

    private final JobDescriptionAIService jobDescriptionAIService;

    @PostMapping("/generate")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<JobDescriptionResponse> generateJobDescription(
            @RequestBody JobDescriptionRequest request) {
        try {
            log.info("Generating job description for: {}", request.getJobTitle());
            
            JobDescriptionResponse response = jobDescriptionAIService.generateJobDescription(request);
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error generating job description", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/optimize")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<Map<String, String>> optimizeDescription(
            @RequestBody Map<String, String> request) {
        try {
            String description = request.get("description");
            
            if (description == null || description.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            log.info("Optimizing job description");
            
            String optimizedDescription = jobDescriptionAIService.optimizeDescription(description);
            
            Map<String, String> response = Map.of("optimizedDescription", optimizedDescription);
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error optimizing description", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/validate")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<Map<String, String>> validateDescription(
            @RequestBody Map<String, String> request) {
        try {
            String description = request.get("description");
            
            if (description == null || description.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            log.info("Validating job description");
            
            String validationResult = jobDescriptionAIService.validateDescription(description);
            
            Map<String, String> response = Map.of("validationResult", validationResult);
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error validating description", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/seo-keywords")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<Map<String, String>> generateSEOKeywords(
            @RequestBody Map<String, String> request) {
        try {
            String jobTitle = request.get("jobTitle");
            String skills = request.get("skills");
            String location = request.get("location");
            
            if (jobTitle == null || jobTitle.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            log.info("Generating SEO keywords for: {}", jobTitle);
            
            String keywords = jobDescriptionAIService.generateSEOKeywords(
                jobTitle, 
                skills != null ? skills : "", 
                location != null ? location : ""
            );
            
            Map<String, String> response = Map.of("keywords", keywords);
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error generating SEO keywords", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<ResponseDTO> healthCheck() {
        return new ResponseEntity<>(new ResponseDTO("Job Description AI Service is running"), HttpStatus.OK);
    }
}
