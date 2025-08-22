# AI Integration Guide for Job Portal

## 🤖 Available AI Providers

### 1. **Hugging Face (RECOMMENDED for hosting) - FREE**
- **Cost**: Free up to 30,000 requests/month
- **Setup**: Requires API key from Hugging Face
- **Best for**: Production hosting, MVP, testing

### 2. **OpenAI API (ChatGPT) - PAID**
- **Cost**: ~$0.002 per 1K tokens (~$0.01-0.05 per request)
- **Setup**: Requires OpenAI API key
- **Best for**: High-quality production use

### 3. **Ollama (Local) - FREE**
- **Cost**: Completely free
- **Setup**: Requires local installation
- **Best for**: Development, local testing

## 🚀 Quick Setup for Hosting (Hugging Face)

### Step 1: Get Hugging Face API Key
1. Go to [Hugging Face](https://huggingface.co/settings/tokens)
2. Create account (free)
3. Generate new API token
4. Copy the token

### Step 2: Configure Backend
Add to `backend/src/main/resources/application.properties`:
```properties
# Hugging Face Configuration
spring.ai.huggingface.api-key=your-huggingface-api-key-here
spring.ai.huggingface.base-url=https://api-inference.huggingface.co
spring.ai.huggingface.model=microsoft/DialoGPT-medium
```

### Step 3: Deploy
The AI will automatically use Hugging Face when the API key is configured.

## 🔧 Advanced Configuration

### For Production (OpenAI)
```properties
# OpenAI Configuration
spring.ai.openai.api-key=your-openai-api-key-here
spring.ai.openai.base-url=https://api.openai.com
```

### For Local Development (Ollama)
```properties
# Ollama Configuration
spring.ai.ollama.base-url=http://localhost:11434
spring.ai.ollama.chat.model=llama2
```

## 📊 Cost Comparison

| Provider | Cost | Requests/Month | Best For |
|----------|------|----------------|----------|
| Hugging Face | Free | 30,000 | Hosting, MVP |
| OpenAI | ~$0.01/request | Unlimited | Production |
| Ollama | Free | Unlimited | Local dev |

## 🎯 Features

### Dynamic Job Description Generation
- **About Job**: Smart generation based on job title, skills, and experience
- **Responsibilities**: Tailored to experience level and technologies
- **We Offer**: Adaptive benefits based on salary, company type, and job type
- **Call to Action**: Random selection from 6 different options

### Smart Analysis
- **Experience Level**: Junior/Middle/Senior/Lead detection
- **Technology Stack**: Java, React, Python, DevOps, etc.
- **Role Type**: Developer, Engineer, Architect, etc.
- **Company Type**: Tech companies get additional benefits

## 🔄 Priority Order
The system tries AI providers in this order:
1. **OpenAI** (if API key configured)
2. **Hugging Face** (if API key configured)
3. **Ollama** (fallback for local development)

## 🚨 Important Notes

### For Hosting:
- **Don't use Ollama** - it only works locally
- **Use Hugging Face** for free hosting
- **Use OpenAI** for high-quality production

### API Keys:
- Keep API keys secure
- Use environment variables in production
- Never commit API keys to git

### Rate Limits:
- Hugging Face: 30,000 requests/month (free)
- OpenAI: Based on your plan
- Ollama: No limits (local only)

## 🛠️ Troubleshooting

### Hugging Face Issues:
- Check API key is valid
- Verify model name is correct
- Check rate limits

### OpenAI Issues:
- Verify API key has credits
- Check model availability
- Monitor usage costs

### Ollama Issues:
- Ensure Ollama is running locally
- Check model is downloaded
- Verify port 11434 is accessible
