package com.jobportal.api;

import com.jobportal.dto.EmployerLeaderboardDTO;
import com.jobportal.dto.ResponseDTO;
import com.jobportal.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LeaderboardAPI {

    private final LeaderboardService leaderboardService;
    private final RedisTemplate<String, Object> redisTemplate;
    
    private static final String LEADERBOARD_KEY = "employer_leaderboard";

    @GetMapping("/employers")
    public ResponseEntity<List<EmployerLeaderboardDTO>> getTopEmployers(
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<EmployerLeaderboardDTO> topEmployers = leaderboardService.getTopEmployers(limit);
            return ResponseEntity.ok(topEmployers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/employers/{employerId}/rank")
    public ResponseEntity<Integer> getEmployerRank(@PathVariable String employerId) {
        try {
            Integer rank = leaderboardService.getEmployerRank(employerId);
            if (rank != null) {
                return ResponseEntity.ok(rank);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/debug")
    public ResponseEntity<String> debugLeaderboard() {
        try {
            // Проверяем подключение к Redis
            redisTemplate.opsForValue().set("test", "test");
            String testValue = (String) redisTemplate.opsForValue().get("test");
            
            // Получаем все записи из leaderboard
            Set<Object> allEmployers = redisTemplate.opsForZSet().range(LEADERBOARD_KEY, 0, -1);
            
            StringBuilder debug = new StringBuilder();
            debug.append("Redis connection: ").append(testValue != null ? "OK" : "FAILED").append("\n");
            debug.append("Leaderboard key exists: ").append(redisTemplate.hasKey(LEADERBOARD_KEY)).append("\n");
            debug.append("Total employers in leaderboard: ").append(allEmployers != null ? allEmployers.size() : 0).append("\n");
            
            if (allEmployers != null && !allEmployers.isEmpty()) {
                debug.append("Employers: ");
                allEmployers.forEach(emp -> {
                    Double score = redisTemplate.opsForZSet().score(LEADERBOARD_KEY, emp);
                    debug.append(emp).append("(").append(score).append(") ");
                });
            }
            
            return ResponseEntity.ok(debug.toString());
        } catch (Exception e) {
            return ResponseEntity.ok("Error: " + e.getMessage());
        }
    }

    @PostMapping("/init")
    public ResponseEntity<String> initializeLeaderboard() {
        try {
            // Ручная инициализация leaderboard
            leaderboardService.updateEmployerJobCount("1", 5L); // Тестовые данные
            return ResponseEntity.ok("Leaderboard initialized with test data");
        } catch (Exception e) {
            return ResponseEntity.ok("Error: " + e.getMessage());
        }
    }
}
