# Environment Variables Setup Guide

This guide will help you set up environment variables for the JobPortal application.

## Quick Start

1. **Copy the example file:**
   ```bash
   # Linux/Mac
   cp env.example .env
   
   # Windows (PowerShell)
   Copy-Item env.example .env
   ```

2. **Fill in your API keys and configuration**
3. **Start the application**

## Required Environment Variables

### Database Configuration
```env
MONGODB_URI=mongodb://localhost:27018/jobportal
```

### Email Configuration
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### AI Services Configuration

#### OpenAI
```env
OPENAI_API_KEY=your-openai-api-key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo
```

#### Ollama (Local AI)
```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

#### Hugging Face
```env
HUGGINGFACE_API_KEY=your-huggingface-api-key
HUGGINGFACE_BASE_URL=https://api-inference.huggingface.co
HUGGINGFACE_MODEL=meta-llama/Llama-2-7b-chat-hf
```

### AI Service Selection
```env
AI_SERVICE=openai  # openai, ollama, huggingface
AI_TIMEOUT=30000
AI_MAX_TOKENS=2000
AI_TEMPERATURE=0.7
```

### Security
```env
JWT_SECRET=your-super-secret-jwt-key
```

### Message Broker
```env
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
```

### Cache
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

## How to Get API Keys

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to "API Keys" section
4. Create a new API key
5. Copy and paste it into your `.env` file

### Hugging Face API Key
1. Go to [Hugging Face](https://huggingface.co/)
2. Sign up or log in
3. Go to "Settings" → "Access Tokens"
4. Create a new token
5. Copy and paste it into your `.env` file

### Gmail App Password
1. Enable 2-factor authentication on your Google account
2. Go to "Security" → "App passwords"
3. Generate a new app password for "Mail"
4. Use this password in `EMAIL_PASSWORD`

## Security Best Practices

1. **Never commit `.env` files to version control**
2. **Use strong, unique passwords**
3. **Rotate API keys regularly**
4. **Use environment-specific configurations**
5. **Limit API key permissions**

## Docker Configuration

When using Docker Compose, environment variables are automatically passed from your `.env` file to the backend container.

```yaml
# docker-compose.yml
services:
  backend:
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      # ... other variables
```

## Troubleshooting

### Common Issues

1. **"API key not found" error**
   - Check that your API key is correctly set in `.env`
   - Verify the key has the necessary permissions

2. **"Connection refused" for local services**
   - Ensure MongoDB, Redis, and Kafka are running
   - Check port configurations

3. **Email sending fails**
   - Verify Gmail app password is correct
   - Check if 2FA is enabled on your Google account

### Testing Configuration

You can test your configuration by running:
```bash
cd backend
mvn spring-boot:run
```

Check the console output for any configuration errors.

## Environment-Specific Configurations

### Development
```env
SPRING_PROFILES_ACTIVE=dev
LOG_LEVEL=DEBUG
```

### Production
```env
SPRING_PROFILES_ACTIVE=prod
LOG_LEVEL=WARN
```

### Testing
```env
SPRING_PROFILES_ACTIVE=test
AI_SERVICE=mock
```

## Support

If you encounter issues with environment setup:
1. Check the application logs
2. Verify all required variables are set
3. Test individual services (MongoDB, Redis, etc.)
4. Consult the troubleshooting section above
