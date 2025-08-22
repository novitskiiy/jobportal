# 🏆 Employer Leaderboard Feature

## Описание

Добавлена новая функциональность **Leaderboard работодателей** с использованием Redis для быстрого отображения топ работодателей по количеству размещенных вакансий.

## Технологии

- **Redis** - для хранения и быстрого доступа к данным leaderboard
- **Spring Boot Data Redis** - для интеграции с Redis
- **React + TypeScript** - для фронтенд интерфейса
- **Docker Compose** - для оркестрации всех сервисов

## Архитектура

### Backend
- `RedisConfig.java` - конфигурация Redis
- `LeaderboardService.java` - интерфейс сервиса
- `LeaderboardServiceImpl.java` - реализация с использованием Redis Sorted Set
- `LeaderboardAPI.java` - REST API контроллер
- `LeaderboardInitializationService.java` - инициализация с существующими данными
- `EmployerLeaderboardDTO.java` - DTO для передачи данных

### Frontend
- `LeaderboardService.tsx` - сервис для работы с API
- `Leaderboard.tsx` - основной компонент
- `LeaderboardCard.tsx` - карточка работодателя
- `LeaderboardPage.tsx` - страница leaderboard

## Функциональность

### Для Applicant (соискателей):
- Просмотр топ работодателей по количеству активных вакансий
- Отображение рейтинга с медалями (🥇🥈🥉)
- Фильтрация по количеству отображаемых записей (5, 10, 20, 50)
- Автоматическое обновление при изменении данных

### Автоматическое обновление:
- При создании новой вакансии
- При удалении вакансии
- При изменении статуса вакансии на CLOSED

## Запуск проекта

### 1. Запуск всех сервисов
```bash
docker-compose up -d
```

Это запустит:
- MongoDB (порт 27018)
- Redis (порт 6379)
- Backend (порт 8080)
- Frontend (порт 80)
- Kafka + Zookeeper

### 2. Доступ к приложению
- Frontend: http://localhost
- Backend API: http://localhost:8080
- Redis CLI: `docker exec -it redis redis-cli`

### 3. API Endpoints

#### Получить топ работодателей
```
GET /api/leaderboard/employers?limit=10
```

#### Получить позицию работодателя
```
GET /api/leaderboard/employers/{employerId}/rank
```

## Redis Структура данных

Используется **Sorted Set** с ключом `employer_leaderboard`:
- **Member**: ID работодателя (String)
- **Score**: количество активных вакансий (Double)

### Пример Redis команд:
```bash
# Просмотр всех записей
ZREVRANGE employer_leaderboard 0 -1 WITHSCORES

# Получить топ 10
ZREVRANGE employer_leaderboard 0 9 WITHSCORES

# Получить позицию работодателя
ZREVRANK employer_leaderboard "123"
```

## Навигация

Для Applicant добавлена новая вкладка "Leaderboard" в главном меню, которая ведет на `/leaderboard`.

## Особенности реализации

1. **Производительность**: Redis Sorted Set обеспечивает O(log N) для операций вставки и O(log N + M) для получения топ записей
2. **Автоматическая синхронизация**: Leaderboard обновляется автоматически при изменении вакансий
3. **Отказоустойчивость**: Обработка ошибок Redis с fallback на логирование
4. **Инициализация**: При запуске приложения leaderboard автоматически заполняется существующими данными
5. **UI/UX**: Современный дизайн с анимациями и адаптивностью

## Мониторинг

Логи инициализации и обновлений leaderboard можно найти в логах backend приложения:
```bash
docker logs backend
```

## Расширение функциональности

Возможные улучшения:
- Добавление временных фильтров (топ за неделю/месяц)
- Интеграция с уведомлениями о новых лидерах
- Статистика по отраслям
- Экспорт данных leaderboard
