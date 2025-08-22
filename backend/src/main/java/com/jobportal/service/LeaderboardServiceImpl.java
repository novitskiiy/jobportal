package com.jobportal.service;

import com.jobportal.dto.EmployerLeaderboardDTO;
import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeaderboardServiceImpl implements LeaderboardService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final UserRepository userRepository;
    
    private static final String LEADERBOARD_KEY = "employer_leaderboard";

    @Override
    public void updateEmployerJobCount(String employerId, Long jobCount) {
        try {
            log.info("Attempting to update leaderboard for employer {} with job count: {}", employerId, jobCount);
            log.info("Redis template is null: {}", redisTemplate == null);
            if (redisTemplate != null) {
                log.info("Redis connection factory is null: {}", redisTemplate.getConnectionFactory() == null);
            }
            redisTemplate.opsForZSet().add(LEADERBOARD_KEY, employerId, jobCount.doubleValue());
            log.info("Updated leaderboard for employer {} with job count: {}", employerId, jobCount);
        } catch (Exception e) {
            log.error("Error updating leaderboard for employer {}: {}", employerId, e.getMessage(), e);
            log.error("Full stack trace:", e);
        }
    }

    @Override
    public List<EmployerLeaderboardDTO> getTopEmployers(int limit) {
        List<EmployerLeaderboardDTO> result = new ArrayList<>();
        
        try {
            log.info("Getting top employers with limit: {}", limit);
            
            // Получаем топ работодателей в порядке убывания (с наибольшим количеством вакансий)
            Set<Object> topEmployerIds = redisTemplate.opsForZSet()
                    .reverseRange(LEADERBOARD_KEY, 0, limit - 1);
            
            log.info("Found {} employers in Redis leaderboard", topEmployerIds != null ? topEmployerIds.size() : 0);
            
            if (topEmployerIds != null) {
                int rank = 1;
                for (Object employerIdObj : topEmployerIds) {
                    String employerId = (String) employerIdObj;
                    
                    // Получаем количество вакансий
                    Double score = redisTemplate.opsForZSet().score(LEADERBOARD_KEY, employerId);
                    Long jobCount = score != null ? score.longValue() : 0L;
                    
                    // Получаем информацию о пользователе
                    User user = userRepository.findById(Long.valueOf(employerId)).orElse(null);
                    if (user != null) {
                        EmployerLeaderboardDTO dto = new EmployerLeaderboardDTO();
                        dto.setEmployerId(employerId);
                        dto.setEmployerName(user.getName() != null ? user.getName() : "Unknown User");
                        dto.setJobCount(jobCount);
                        dto.setRank(rank);
                        dto.setAvatar("/avatar.png"); // Можно добавить поле avatar в User entity позже
                        
                        result.add(dto);
                        rank++;
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error getting top employers: {}", e.getMessage());
            log.error("Full stack trace:", e);
        }
        
        return result;
    }

    @Override
    public Integer getEmployerRank(String employerId) {
        try {
            Long rank = redisTemplate.opsForZSet().reverseRank(LEADERBOARD_KEY, employerId);
            return rank != null ? rank.intValue() + 1 : null; // Redis rank is 0-based, we return 1-based
        } catch (Exception e) {
            log.error("Error getting rank for employer {}: {}", employerId, e.getMessage());
            log.error("Full stack trace:", e);
            return null;
        }
    }

    @Override
    public void removeEmployer(String employerId) {
        try {
            redisTemplate.opsForZSet().remove(LEADERBOARD_KEY, employerId);
            log.info("Removed employer {} from leaderboard", employerId);
        } catch (Exception e) {
            log.error("Error removing employer {} from leaderboard: {}", employerId, e.getMessage());
            log.error("Full stack trace:", e);
        }
    }
}
