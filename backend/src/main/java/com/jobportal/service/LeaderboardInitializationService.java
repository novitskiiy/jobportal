package com.jobportal.service;

import com.jobportal.entity.Job;
import com.jobportal.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeaderboardInitializationService {

    private final JobRepository jobRepository;
    private final LeaderboardService leaderboardService;

    @EventListener(ApplicationReadyEvent.class)
    public void initializeLeaderboard() {
        try {
            log.info("Starting leaderboard initialization...");
            
            // Получаем все вакансии для отладки
            var allJobs = jobRepository.findAll();
            log.info("Total jobs in database: {}", allJobs.size());
            
            // Получаем все активные вакансии
            var activeJobs = allJobs.stream()
                    .filter(job -> !job.getJobStatus().toString().equals("CLOSED"))
                    .collect(Collectors.toList());
            
            log.info("Active jobs (not CLOSED): {}", activeJobs.size());
            
            // Логируем статусы всех вакансий
            allJobs.forEach(job -> {
                log.info("Job ID: {}, Status: {}, PostedBy: {}", job.getId(), job.getJobStatus(), job.getPostedBy());
            });
            
            // Группируем по работодателям и подсчитываем количество вакансий
            Map<Long, Long> employerJobCounts = activeJobs.stream()
                    .collect(Collectors.groupingBy(
                            Job::getPostedBy,
                            Collectors.counting()
                    ));
            
            log.info("Employer job counts: {}", employerJobCounts);
            
            // Обновляем leaderboard для каждого работодателя
            employerJobCounts.forEach((employerId, jobCount) -> {
                leaderboardService.updateEmployerJobCount(employerId.toString(), jobCount);
                log.info("Initialized leaderboard for employer {} with {} jobs", employerId, jobCount);
            });
            
            log.info("Leaderboard initialization completed. Processed {} employers with {} total active jobs", 
                    employerJobCounts.size(), activeJobs.size());
                    
        } catch (Exception e) {
            log.error("Error during leaderboard initialization: {}", e.getMessage(), e);
        }
    }
}
