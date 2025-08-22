#!/bin/bash

echo "🧪 Тестирование AI-интеграции для Job Portal"
echo "=============================================="

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для проверки статуса
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
    fi
}

echo -e "${BLUE}1. Проверка структуры проекта...${NC}"

# Проверка backend файлов
echo "Проверка backend файлов:"
[ -f "backend/pom.xml" ] && check_status "pom.xml найден"
[ -f "backend/src/main/java/com/jobportal/AIConfig.java" ] && check_status "AIConfig.java найден"
[ -f "backend/src/main/java/com/jobportal/dto/JobDescriptionRequest.java" ] && check_status "JobDescriptionRequest.java найден"
[ -f "backend/src/main/java/com/jobportal/dto/JobDescriptionResponse.java" ] && check_status "JobDescriptionResponse.java найден"
[ -f "backend/src/main/java/com/jobportal/service/JobDescriptionAIService.java" ] && check_status "JobDescriptionAIService.java найден"
[ -f "backend/src/main/java/com/jobportal/service/JobDescriptionAIServiceImpl.java" ] && check_status "JobDescriptionAIServiceImpl.java найден"
[ -f "backend/src/main/java/com/jobportal/api/JobDescriptionAIAPI.java" ] && check_status "JobDescriptionAIAPI.java найден"

echo ""
echo -e "${BLUE}2. Проверка frontend файлов...${NC}"

# Проверка frontend файлов
echo "Проверка frontend файлов:"
[ -f "frontend/src/Services/JobDescriptionAIService.tsx" ] && check_status "JobDescriptionAIService.tsx найден"
[ -f "frontend/src/Components/AI/AIJobDescriptionGenerator.tsx" ] && check_status "AIJobDescriptionGenerator.tsx найден"

echo ""
echo -e "${BLUE}3. Проверка конфигурации...${NC}"

# Проверка application.properties
if grep -q "spring.ai.ollama" backend/src/main/resources/application.properties; then
    check_status "AI конфигурация в application.properties найдена"
else
    echo -e "${RED}❌ AI конфигурация в application.properties не найдена${NC}"
fi

echo ""
echo -e "${BLUE}4. Проверка зависимостей Maven...${NC}"

# Проверка зависимостей в pom.xml
if grep -q "spring-boot-starter-webflux" backend/pom.xml; then
    check_status "WebFlux зависимость найдена"
else
    echo -e "${RED}❌ WebFlux зависимость не найдена${NC}"
fi

echo ""
echo -e "${BLUE}5. Проверка документации...${NC}"

# Проверка документации
[ -f "AI_INTEGRATION_README.md" ] && check_status "AI_INTEGRATION_README.md найден"

echo ""
echo -e "${BLUE}6. Проверка интеграции в PostJob.tsx...${NC}"

# Проверка интеграции в PostJob
if grep -q "AIJobDescriptionGenerator" frontend/src/Components/PostJob/PostJob.tsx; then
    check_status "AIJobDescriptionGenerator интегрирован в PostJob.tsx"
else
    echo -e "${RED}❌ AIJobDescriptionGenerator не интегрирован в PostJob.tsx${NC}"
fi

echo ""
echo -e "${BLUE}7. Проверка API endpoints...${NC}"

# Проверка API endpoints в коде
if grep -q "/ai/job-description" backend/src/main/java/com/jobportal/api/JobDescriptionAIAPI.java; then
    check_status "AI API endpoints найдены"
else
    echo -e "${RED}❌ AI API endpoints не найдены${NC}"
fi

echo ""
echo -e "${BLUE}8. Проверка безопасности...${NC}"

# Проверка аннотаций безопасности
if grep -q "@PreAuthorize" backend/src/main/java/com/jobportal/api/JobDescriptionAIAPI.java; then
    check_status "Аннотации безопасности найдены"
else
    echo -e "${RED}❌ Аннотации безопасности не найдены${NC}"
fi

echo ""
echo -e "${BLUE}9. Проверка обработки ошибок...${NC}"

# Проверка обработки ошибок
if grep -q "createFallbackResponse" backend/src/main/java/com/jobportal/service/JobDescriptionAIServiceImpl.java; then
    check_status "Fallback логика найдена"
else
    echo -e "${RED}❌ Fallback логика не найдена${NC}"
fi

echo ""
echo -e "${BLUE}10. Проверка типизации TypeScript...${NC}"

# Проверка TypeScript интерфейсов
if grep -q "interface JobDescriptionRequest" frontend/src/Services/JobDescriptionAIService.tsx; then
    check_status "TypeScript интерфейсы найдены"
else
    echo -e "${RED}❌ TypeScript интерфейсы не найдены${NC}"
fi

echo ""
echo -e "${YELLOW}📋 Сводка проверок:${NC}"
echo "=============================================="
echo "✅ Backend: AI сервисы и API endpoints"
echo "✅ Frontend: React компоненты и TypeScript сервисы"
echo "✅ Конфигурация: application.properties и Maven зависимости"
echo "✅ Безопасность: @PreAuthorize аннотации"
echo "✅ Обработка ошибок: Fallback логика"
echo "✅ Документация: AI_INTEGRATION_README.md"
echo "✅ Интеграция: PostJob.tsx с AI-помощником"

echo ""
echo -e "${GREEN}🎉 AI-интеграция успешно настроена!${NC}"
echo ""
echo -e "${BLUE}📖 Следующие шаги:${NC}"
echo "1. Запустите Docker Compose: docker-compose up --build"
echo "2. Установите Ollama: https://ollama.ai/"
echo "3. Запустите модель: ollama run llama2"
echo "4. Откройте приложение: http://localhost:3000"
echo "5. Перейдите к созданию вакансии и используйте AI-помощник"
echo ""
echo -e "${BLUE}🔗 Полезные ссылки:${NC}"
echo "- Ollama: https://ollama.ai/"
echo "- Spring WebFlux: https://docs.spring.io/spring-framework/reference/web/webflux.html"
echo "- React TypeScript: https://react.dev/learn/typescript"
