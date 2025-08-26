# JobPortal Deployment Guide

## Overview
This guide provides instructions for deploying the JobPortal application to a production server using Docker.

## Prerequisites
- Docker and Docker Compose installed on the server
- Domain name configured (optional but recommended)
- SSL certificate (recommended for production)

## Quick Start

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd jobportal
```

### 2. Configure Environment Variables
```bash
# Copy the production environment template
cp env.production.example .env

# Edit the .env file with your production values
nano .env
```

### 3. Update Configuration
Make sure to update the following in your `.env` file:
- `REACT_APP_API_URL` - Your domain or server IP for API
- `REACT_APP_WS_URL` - Your domain or server IP for WebSocket
- `JWT_SECRET` - A strong, unique secret key
- `EMAIL_USERNAME` and `EMAIL_PASSWORD` - Your email credentials
- `HUGGINGFACE_API_KEY` - Your Hugging Face API key (optional)
- `OPENAI_API_KEY` - Your OpenAI API key (optional)

### 4. Deploy with Docker Compose
```bash
# For development/testing
docker-compose up -d

# For production
docker-compose -f docker-compose.prod.yml up -d
```

### 5. Verify Deployment
```bash
# Check if all services are running
docker-compose ps

# Check logs
docker-compose logs -f

# Test the application
curl http://localhost:80
```

## Production Deployment

### Using Production Compose File
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### Environment Variables for Production
Create a `.env` file with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://mongodb:27017/jobportal

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-production-email@gmail.com
EMAIL_PASSWORD=your-production-app-password

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-for-production
JWT_EXPIRATION=3600000

# Frontend Configuration
REACT_APP_API_URL=http://your-domain.com:8080
REACT_APP_WS_URL=ws://your-domain.com:8080

# AI Service Configuration
HUGGINGFACE_API_KEY=your-huggingface-api-key-here
OPENAI_API_KEY=your-openai-api-key-here
OLLAMA_BASE_URL=http://your-ollama-server:11434

# Application Settings
SPRING_PROFILES_ACTIVE=prod
SWAGGER_ENABLED=false
```

## Security Considerations

### 1. JWT Secret
- Use a strong, random secret key
- Change it regularly
- Keep it secure and don't commit to version control

### 2. Database Security
- Consider using MongoDB authentication
- Restrict network access to MongoDB port
- Regular backups

### 3. Redis Security
- Set a strong Redis password
- Restrict network access

### 4. API Security
- Use HTTPS in production
- Implement rate limiting
- Regular security updates

## Monitoring and Maintenance

### Health Checks
All services include health checks that can be monitored:
```bash
# Check health status
docker-compose ps

# View health check logs
docker-compose logs backend | grep health
```

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Backup
```bash
# Backup MongoDB data
docker exec mongodb-prod mongodump --out /backup

# Backup Redis data (if needed)
docker exec redis-prod redis-cli BGSAVE
```

## Troubleshooting

### Common Issues

1. **Services not starting**
   - Check if ports are already in use
   - Verify environment variables
   - Check Docker logs

2. **Database connection issues**
   - Verify MongoDB is running
   - Check connection string
   - Ensure network connectivity

3. **Frontend not loading**
   - Check if backend is healthy
   - Verify API URL configuration
   - Check nginx logs

### Useful Commands
```bash
# Restart specific service
docker-compose restart backend

# Rebuild and restart
docker-compose up -d --build

# View resource usage
docker stats

# Clean up unused resources
docker system prune -a
```

## SSL/HTTPS Setup (Recommended)

For production, it's recommended to set up SSL certificates:

1. **Using Let's Encrypt with Nginx Proxy**
2. **Using Cloudflare SSL**
3. **Using reverse proxy (Nginx/Traefik)**

## Scaling Considerations

For high-traffic applications:
- Consider using external MongoDB cluster
- Use Redis cluster for caching
- Implement load balancing
- Use CDN for static assets

## Support

For issues and questions:
- Check the logs first
- Review this documentation
- Check GitHub issues
- Contact the development team
