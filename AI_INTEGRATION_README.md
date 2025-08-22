# AI-помощник для описаний вакансий

## Описание

AI-помощник для написания описаний вакансий - это интеллектуальная система, которая помогает работодателям создавать привлекательные и профессиональные описания вакансий с помощью искусственного интеллекта.

## Возможности

### 🎯 Основные функции
- **Генерация описаний** - создание полных описаний вакансий на основе базовой информации
- **Оптимизация текста** - улучшение существующих описаний для лучшего поиска
- **Проверка качества** - анализ соответствия стандартам HR и маркетинга
- **SEO-оптимизация** - генерация ключевых слов для улучшения поиска

### 🎨 Настройки
- **Тон описания**: профессиональный, дружелюбный, неформальный, формальный
- **Язык**: русский, английский
- **Кастомизация**: дополнительные требования, условия работы

## Техническая архитектура

### Backend (Spring Boot + Spring AI)

#### Зависимости
```xml
<!-- Spring AI Dependencies -->
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-ollama-spring-boot-starter</artifactId>
</dependency>
```

#### Основные компоненты

1. **AIConfig.java** - конфигурация AI провайдеров
2. **JobDescriptionAIService.java** - интерфейс сервиса
3. **JobDescriptionAIServiceImpl.java** - реализация с Spring AI
4. **JobDescriptionAIAPI.java** - REST API контроллер
5. **JobDescriptionRequest.java** - DTO для запросов
6. **JobDescriptionResponse.java** - DTO для ответов

#### API Endpoints

```
POST /ai/job-description/generate    - Генерация описания
POST /ai/job-description/optimize    - Оптимизация описания
POST /ai/job-description/validate    - Проверка качества
POST /ai/job-description/seo-keywords - Генерация SEO ключевых слов
GET  /ai/job-description/health      - Проверка статуса сервиса
```

### Frontend (React + TypeScript)

#### Основные компоненты

1. **JobDescriptionAIService.tsx** - сервис для работы с AI API
2. **AIJobDescriptionGenerator.tsx** - основной компонент AI-помощника
3. **Интеграция в PostJob.tsx** - встраивание в форму создания вакансии

## Настройка

### 1. Backend настройка

#### Конфигурация в application.properties
```properties
# Spring AI Configuration
# OpenAI Configuration (optional)
# spring.ai.openai.api-key=your-openai-api-key-here
# spring.ai.openai.base-url=https://api.openai.com

# Ollama Configuration (default - runs locally)
spring.ai.ollama.base-url=http://localhost:11434
spring.ai.ollama.chat.model=llama2

# AI Service Configuration
ai.job-description.enabled=true
ai.job-description.max-length=2000
```

#### Варианты AI провайдеров

**Option 1: OpenAI (рекомендуется для продакшена)**
1. Получите API ключ на https://platform.openai.com/
2. Раскомментируйте строки в application.properties:
```properties
spring.ai.openai.api-key=your-openai-api-key-here
spring.ai.openai.base-url=https://api.openai.com
```

**Option 2: Ollama (для локальной разработки)**
1. Установите Ollama: https://ollama.ai/
2. Запустите модель:
```bash
ollama pull llama2
ollama run llama2
```

**Option 3: Vertex AI (Google)**
1. Настройте Google Cloud Project
2. Добавьте зависимость:
```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-vertex-ai-gemini-spring-boot-starter</artifactId>
</dependency>
```

### 2. Frontend настройка

#### Установка зависимостей
```bash
cd frontend
npm install
```

#### Настройка переменных окружения
Создайте файл `.env`:
```env
REACT_APP_API_URL=http://localhost:8080
```

## Использование

### Для работодателей

1. **Перейдите к созданию вакансии**
   - Откройте страницу "Post a Job"
   - Заполните основную информацию о вакансии

2. **Используйте AI-помощник**
   - Нажмите "Показать AI-помощник"
   - Заполните необходимые поля (должность, навыки, опыт)
   - Нажмите "Сгенерировать описание"

3. **Настройте результат**
   - Просмотрите сгенерированное описание
   - При необходимости отредактируйте текст
   - Используйте вкладки для оптимизации и SEO

4. **Примените описание**
   - Нажмите "Использовать это описание"
   - Описание автоматически заполнит поле "Job Description"

### Возможности AI-помощника

#### 📝 Генерация описания
- Введите название должности и требуемые навыки
- Выберите тон и язык описания
- Получите профессиональное описание с оценкой качества

#### 🔧 Оптимизация
- Улучшите существующее описание
- Сделайте текст более привлекательным для кандидатов
- Оптимизируйте для поисковых систем

#### 🔍 SEO-ключевые слова
- Генерируйте релевантные ключевые слова
- Улучшайте видимость вакансии в поиске
- Включайте синонимы и связанные термины

#### ✅ Проверка качества
- Анализ соответствия HR стандартам
- Рекомендации по улучшению
- Проверка правовых аспектов

## Примеры использования

### Пример 1: Генерация описания для Java Developer
```json
{
  "jobTitle": "Senior Java Developer",
  "skillsRequired": ["Java", "Spring Boot", "MongoDB", "Kafka"],
  "experience": "3-5 years",
  "company": "TechCorp",
  "location": "Москва",
  "tone": "professional",
  "language": "ru"
}
```

### Пример 2: Оптимизация существующего описания
```json
{
  "description": "Ищем Java разработчика для работы с микросервисами..."
}
```

## Безопасность

### Аутентификация
- Все AI endpoints защищены Spring Security
- Требуется роль `EMPLOYER` для доступа
- JWT токен передается в заголовках

### Валидация данных
- Проверка входных данных на стороне сервера
- Ограничение длины текста
- Санитизация пользовательского ввода

### Rate Limiting
- Ограничение количества запросов к AI API
- Защита от злоупотреблений
- Мониторинг использования

## Мониторинг и логирование

### Логирование
```java
@Slf4j
public class JobDescriptionAIServiceImpl {
    log.info("Generating job description for: {}", request.getJobTitle());
    log.error("Error generating job description", e);
}
```

### Метрики
- Количество сгенерированных описаний
- Время ответа AI сервиса
- Оценки качества описаний
- Популярные навыки и должности

## Troubleshooting

### Частые проблемы

1. **AI сервис недоступен**
   - Проверьте статус Ollama: `ollama list`
   - Убедитесь, что модель загружена: `ollama pull llama2`

2. **Медленные ответы**
   - Используйте более мощную модель
   - Оптимизируйте промпты
   - Рассмотрите кэширование

3. **Ошибки парсинга JSON**
   - Проверьте формат ответа AI
   - Добавьте fallback логику
   - Улучшите промпты

### Отладка

#### Backend
```bash
# Проверка статуса AI сервиса
curl -X GET http://localhost:8080/ai/job-description/health

# Тест генерации описания
curl -X POST http://localhost:8080/ai/job-description/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"jobTitle":"Java Developer","skillsRequired":["Java"]}'
```

#### Frontend
```javascript
// Проверка подключения к API
await JobDescriptionAIService.healthCheck();

// Отладка запросов
console.log('AI Request:', request);
console.log('AI Response:', response);
```

## Развитие функционала

### Планируемые улучшения

1. **Многоязычность**
   - Поддержка дополнительных языков
   - Автоматический перевод описаний

2. **Персонализация**
   - Адаптация под стиль компании
   - Сохранение шаблонов

3. **Аналитика**
   - Статистика эффективности описаний
   - A/B тестирование вариантов

4. **Интеграции**
   - Подключение к HR системам
   - Экспорт в различные форматы

### API расширения

```java
// Новые endpoints для будущих версий
@PostMapping("/templates")
@PostMapping("/analytics")
@PostMapping("/translate")
@PostMapping("/export")
```

## Поддержка

### Документация
- [Spring AI Documentation](https://docs.spring.io/spring-ai/reference/)
- [Ollama Documentation](https://ollama.ai/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

### Сообщество
- GitHub Issues для багов
- Discord канал для обсуждений
- Stack Overflow для вопросов

---

**Версия**: 1.0.0  
**Дата**: 2024  
**Автор**: Job Portal Team
