# JobPortal Deployment Guide

## 🚀 Быстрый старт

### 1. Подготовка окружения

```bash
# Клонируйте проект
git clone <your-repo>
cd jobportal

# Скопируйте файл окружения
cp env.production.example .env

# Отредактируйте .env файл с вашими настройками
nano .env
```

### 2. Настройка .env файла

Обязательные переменные для настройки:

```bash
# JWT секрет (минимум 32 символа)
JWT_SECRET=your-super-secure-jwt-secret-key-for-production-minimum-32-characters

# Email настройки
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL (для локального деплоя)
REACT_APP_API_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8080

# AI ключи (опционально)
OPENAI_API_KEY=your-openai-key
HUGGINGFACE_API_KEY=your-huggingface-key
```

### 3. Деплой

```bash
# Деплой production версии
./deploy.sh prod

# Или для development
./deploy.sh dev
```

### 4. Тестирование

```bash
# Проверка статуса деплоя
./test-deployment.sh
```

## 🔧 Исправленные проблемы

### 1. Nginx конфигурация
- ✅ Убрана проблемная строка `gzip_proxied`
- ✅ Упрощена конфигурация для стабильности

### 2. Docker Compose
- ✅ Правильная последовательность запуска сервисов
- ✅ Убраны health checks для упрощения
- ✅ Улучшена структура зависимостей

### 3. Скрипт деплоя
- ✅ Добавлена валидация переменных окружения
- ✅ Улучшена обработка ошибок
- ✅ Добавлена очистка Docker ресурсов
- ✅ Пошаговое ожидание готовности сервисов

### 4. Тестирование
- ✅ Создан скрипт для диагностики деплоя
- ✅ Проверка всех компонентов системы
- ✅ Анализ логов на ошибки

## 📋 Проверка работоспособности

После деплоя проверьте:

1. **Статус контейнеров:**
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   ```

2. **Логи сервисов:**
   ```bash
   # Все сервисы
   docker-compose -f docker-compose.prod.yml logs
   
   # Конкретный сервис
   docker-compose -f docker-compose.prod.yml logs frontend
   ```

3. **Доступность приложения:**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:8080
   - Health check: http://localhost:80/health

## 🛠️ Устранение неполадок

### Проблема: Frontend не запускается
```bash
# Проверьте nginx конфигурацию
docker-compose -f docker-compose.prod.yml logs frontend

# Пересоберите образ
docker-compose -f docker-compose.prod.yml build --no-cache frontend
```

### Проблема: Backend не подключается к БД
```bash
# Проверьте MongoDB
docker-compose -f docker-compose.prod.yml logs mongodb

# Проверьте переменные окружения
docker-compose -f docker-compose.prod.yml exec backend env | grep MONGODB
```

### Проблема: Kafka не запускается
```bash
# Проверьте Zookeeper
docker-compose -f docker-compose.prod.yml logs zookeeper

# Проверьте Kafka
docker-compose -f docker-compose.prod.yml logs kafka
```

## 🔄 Обновление приложения

```bash
# Остановить контейнеры
docker-compose -f docker-compose.prod.yml down

# Пересобрать и запустить
./deploy.sh prod
```

## 📊 Мониторинг

### Логи в реальном времени
```bash
# Все сервисы
docker-compose -f docker-compose.prod.yml logs -f

# Конкретный сервис
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Использование ресурсов
```bash
# Статистика контейнеров
docker stats

# Использование диска
docker system df
```

## 🔒 Безопасность

### Production рекомендации:
1. Измените JWT_SECRET на уникальный
2. Настройте SSL/TLS сертификаты
3. Ограничьте доступ к портам
4. Настройте firewall
5. Регулярно обновляйте образы

### Переменные окружения для production:
```bash
# Для production с доменом
REACT_APP_API_URL=https://your-domain.com/api
REACT_APP_WS_URL=wss://your-domain.com/ws

# Отключить Swagger
SWAGGER_ENABLED=false

# Настроить логирование
LOG_LEVEL_SPRING=WARN
LOG_LEVEL_APP=INFO
```

## 📝 Полезные команды

```bash
# Очистка Docker
docker system prune -a

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs --tail=100

# Перезапуск сервиса
docker-compose -f docker-compose.prod.yml restart backend

# Вход в контейнер
docker-compose -f docker-compose.prod.yml exec backend sh

# Проверка сети
docker network ls
docker network inspect jobportal_jobportal-network
```

## 🆘 Поддержка

Если у вас возникли проблемы:

1. Запустите диагностику: `./test-deployment.sh`
2. Проверьте логи: `docker-compose -f docker-compose.prod.yml logs`
3. Убедитесь, что все переменные окружения настроены
4. Проверьте, что порты не заняты другими сервисами
