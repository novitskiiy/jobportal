package com.jobportal.service;

import com.jobportal.dto.EmployerLeaderboardDTO;
import java.util.List;

public interface LeaderboardService {
    
    /**
     * Обновляет счетчик вакансий для работодателя
     * @param employerId ID работодателя
     * @param jobCount количество вакансий
     */
    void updateEmployerJobCount(String employerId, Long jobCount);
    
    /**
     * Получает топ работодателей по количеству вакансий
     * @param limit количество записей для возврата
     * @return список работодателей с их рейтингом
     */
    List<EmployerLeaderboardDTO> getTopEmployers(int limit);
    
    /**
     * Получает позицию работодателя в рейтинге
     * @param employerId ID работодателя
     * @return позиция в рейтинге (1-based)
     */
    Integer getEmployerRank(String employerId);
    
    /**
     * Удаляет работодателя из leaderboard
     * @param employerId ID работодателя
     */
    void removeEmployer(String employerId);
}
