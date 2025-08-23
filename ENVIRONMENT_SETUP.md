# Environment Setup Guide

## 🔐 Безопасная настройка переменных окружения

Этот проект использует переменные окружения для безопасного хранения чувствительных данных, таких как API ключи и пароли.

### 📋 Шаги настройки:

#### 1. Создание .env файла

Скопируйте файл `env.example` в `.env`:

```bash
cp env.example .env
```

#### 2. Настройка переменных окружения

Отредактируйте файл `.env` и заполните следующие переменные:

##### 🔑 AI Service Configuration

**OpenAI (опционально):**
```env
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_BASE_URL=https://api.openai.com
```

**Hugging Face (бесплатный уровень - 30,000 запросов/месяц):**
```env
HUGGINGFACE_API_KEY=your-huggingface-api-key-here
HUGGINGFACE_BASE_URL=https://api-inference.huggingface.co
HUGGINGFACE_MODEL=microsoft/DialoGPT-medium
```

**Ollama (локальный - по умолчанию):**
```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_CHAT_MODEL=llama2
OLLAMA_EMBEDDING_MODEL=llama2
```

##### 📧 Email Configuration

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

##### 🗄️ Database Configuration

```env
MONGODB_URI=mongodb://localhost:27018/jobportal
```

##### 🔐 JWT Configuration

```env
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRATION=86400000
```

### 🚀 Получение API ключей

#### OpenAI API Key
1. Зарегистрируйтесь на [OpenAI](https://platform.openai.com/)
2. Перейдите в раздел API Keys
3. Создайте новый API ключ
4. Скопируйте ключ в переменную `OPENAI_API_KEY`

#### Hugging Face API Key
1. Зарегистрируйтесь на [Hugging Face](https://huggingface.co/)
2. Перейдите в Settings → Access Tokens
3. Создайте новый токен
4. Скопируйте токен в переменную `HUGGINGFACE_API_KEY`

#### Gmail App Password
1. Включите двухфакторную аутентификацию в Google Account
2. Перейдите в Security → App passwords
3. Создайте новый пароль для приложения
4. Используйте этот пароль в переменной `EMAIL_PASSWORD`

### 🔒 Безопасность

#### ✅ Что включено в .gitignore:
- `.env` файлы
- Все файлы с расширением `.env`
- Локальные конфигурации

#### ⚠️ Важные моменты:
- **НИКОГДА** не коммитьте `.env` файлы в Git
- Используйте разные API ключи для разработки и продакшена
- Регулярно обновляйте API ключи
- Используйте сильные пароли для JWT_SECRET

### 🐳 Docker Configuration

При использовании Docker, передавайте переменные окружения через:

```bash
docker run -e OPENAI_API_KEY=your-key -e HUGGINGFACE_API_KEY=your-key ...
```

Или создайте `docker-compose.override.yml`:

```yaml
version: '3.8'
services:
  backend:
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - HUGGINGFACE_API_KEY=${HUGGINGFACE_API_KEY}
      - EMAIL_USERNAME=${EMAIL_USERNAME}
      - EMAIL_PASSWORD=${EMAIL_PASSWORD}
```

### 🔧 Проверка конфигурации

После настройки переменных окружения:

1. Перезапустите приложение
2. Проверьте логи на наличие ошибок конфигурации
3. Протестируйте AI функциональность

### 📝 Пример полного .env файла

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27018/jobportal

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# AI Service Configuration
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_BASE_URL=https://api.openai.com

OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_CHAT_MODEL=llama2
OLLAMA_EMBEDDING_MODEL=llama2

HUGGINGFACE_API_KEY=hf-your-huggingface-key-here
HUGGINGFACE_BASE_URL=https://api-inference.huggingface.co
HUGGINGFACE_MODEL=microsoft/DialoGPT-medium

# AI Service Settings
AI_JOB_DESCRIPTION_ENABLED=true
AI_JOB_DESCRIPTION_MAX_LENGTH=2000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRATION=86400000

# Application Settings
SPRING_PROFILES_ACTIVE=dev
```

### 🆘 Troubleshooting

#### Проблема: "API key not found"
- Проверьте, что переменная окружения установлена правильно
- Убедитесь, что файл `.env` находится в корне проекта
- Перезапустите приложение

#### Проблема: "Email authentication failed"
- Проверьте правильность EMAIL_USERNAME и EMAIL_PASSWORD
- Убедитесь, что используется App Password, а не обычный пароль
- Проверьте настройки двухфакторной аутентификации

#### Проблема: "Database connection failed"
- Проверьте, что MongoDB запущен
- Убедитесь в правильности MONGODB_URI
- Проверьте доступность порта 27018
