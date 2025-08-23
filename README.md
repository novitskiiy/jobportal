# 🚀 JobPortal - Modern Job Board Platform

A full-stack job portal application built with Spring Boot, React, and MongoDB. Features AI-powered job description generation, real-time notifications, and a modern user interface.

![JobPortal](https://img.shields.io/badge/JobPortal-v1.0-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.2-green)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0+-green)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Environment Setup](#-environment-setup)
- [Development](#-development)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## ✨ Features

### 🎯 Core Functionality
- **User Authentication & Authorization** - JWT-based secure authentication
- **Job Posting & Management** - Create, edit, and manage job listings
- **Job Search & Filtering** - Advanced search with multiple criteria
- **Application System** - Apply to jobs with resume and cover letter
- **Real-time Notifications** - WebSocket-based instant notifications
- **AI-Powered Job Descriptions** - Generate professional job descriptions using AI

### 🤖 AI Integration
- **Multi-AI Provider Support** - OpenAI, Hugging Face, Ollama
- **Smart Job Description Generation** - Context-aware content creation
- **SEO Optimization** - AI-generated keywords and descriptions
- **Content Validation** - AI-powered content quality checks

### 💼 Employer Features
- **Company Profiles** - Detailed company information and branding
- **Applicant Management** - Track and manage job applications
- **Interview Scheduling** - Built-in interview coordination
- **Analytics Dashboard** - Job performance and applicant insights

### 👤 Job Seeker Features
- **Profile Management** - Professional profiles with skills and experience
- **Application Tracking** - Monitor application status in real-time
- **Job Recommendations** - Personalized job suggestions
- **Resume Builder** - Create and manage professional resumes

### 🔔 Real-time Features
- **WebSocket Notifications** - Instant status updates and messages
- **Live Chat** - Real-time communication between employers and candidates
- **Status Updates** - Real-time application status changes
- **Interview Reminders** - Automated interview notifications

## 🛠 Technology Stack

### Backend
- **Java 17** - Modern Java with latest features
- **Spring Boot 3.3.2** - Rapid application development framework
- **Spring Security** - Authentication and authorization
- **Spring Data MongoDB** - NoSQL database integration
- **Spring WebSocket** - Real-time communication
- **Spring Kafka** - Message broker for notifications
- **Redis** - Caching and session management
- **JWT** - Stateless authentication
- **Lombok** - Boilerplate code reduction
- **OpenAPI/Swagger** - API documentation

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Mantine UI** - Modern component library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **WebSocket (STOMP)** - Real-time communication
- **React Hook Form** - Form management
- **TipTap** - Rich text editor

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **MongoDB 8.0+** - NoSQL database
- **Redis 7** - In-memory data store
- **Apache Kafka** - Distributed streaming platform
- **Nginx** - Web server and reverse proxy

### AI Services
- **OpenAI GPT** - Advanced language model
- **Hugging Face** - Open-source AI models
- **Ollama** - Local AI inference

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │◄──►│  (Spring Boot)  │◄──►│   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │   Redis Cache   │              │
         │              └─────────────────┘              │
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│   WebSocket     │◄─────────────┘
                        │   (STOMP)       │
                        └─────────────────┘
                                │
                        ┌─────────────────┐
                        │   Kafka Queue   │
                        └─────────────────┘
                                │
                        ┌─────────────────┐
                        │   AI Services   │
                        │ (OpenAI/HF/etc) │
                        └─────────────────┘
```

## 📋 Prerequisites

- **Docker Desktop** (v20.10+)
- **Git** (v2.30+)
- **Node.js** (v18+ for development)
- **Java 17** (for development)
- **Maven** (v3.8+ for development)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd jobportal
```

### 2. Setup Environment Variables
```bash
# Copy environment template
cp env.example .env

# Edit .env file with your configuration
# See Environment Setup section for details
```

### 3. Start the Application
```bash
# Start all services
docker compose up --build

# Or start in detached mode
docker compose up -d --build
```

### 4. Access the Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **MongoDB**: localhost:27018
- **Redis**: localhost:6379
- **Kafka**: localhost:9092

## ⚙️ Environment Setup

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27018/jobportal

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# AI Services Configuration
OPENAI_API_KEY=your-openai-api-key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo

OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2

HUGGINGFACE_API_KEY=your-huggingface-api-key
HUGGINGFACE_BASE_URL=https://api-inference.huggingface.co
HUGGINGFACE_MODEL=meta-llama/Llama-2-7b-chat-hf

# AI Service Selection
AI_SERVICE=openai
AI_TIMEOUT=30000
AI_MAX_TOKENS=2000
AI_TEMPERATURE=0.7

# Security
JWT_SECRET=your-super-secret-jwt-key

# Message Broker
KAFKA_BOOTSTRAP_SERVERS=localhost:9092

# Cache
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### Setup Scripts

#### Windows (PowerShell)
```powershell
.\setup-env.ps1
```

#### Linux/Mac (Bash)
```bash
chmod +x setup-env.sh
./setup-env.sh
```

For detailed setup instructions, see [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md).

## 💻 Development

### Backend Development

```bash
cd backend

# Run with Maven
mvn spring-boot:run

# Run tests
mvn test

# Build JAR
mvn clean package
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Database Management

```bash
# Access MongoDB shell
docker exec -it mongodb mongosh

# View logs
docker logs mongodb

# Backup database
docker exec mongodb mongodump --out /data/backup
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Job Management
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create new job
- `GET /api/jobs/{id}` - Get job details
- `PUT /api/jobs/{id}` - Update job
- `DELETE /api/jobs/{id}` - Delete job

### Application Management
- `POST /api/applications` - Submit application
- `GET /api/applications` - List applications
- `PUT /api/applications/{id}/status` - Update application status

### AI Services
- `POST /api/ai/generate-description` - Generate job description
- `POST /api/ai/optimize` - Optimize existing description
- `POST /api/ai/validate` - Validate content

### Real-time Endpoints
- `GET /ws` - WebSocket connection
- `/topic/notifications` - Notification broadcasts
- `/user/queue/status-updates` - Status updates

For complete API documentation, visit: http://localhost:8080/swagger-ui.html

## 📁 Project Structure

```
jobportal/
├── 📁 backend/                          # Spring Boot application
│   ├── 📁 src/main/java/com/jobportal/
│   │   ├── 📁 api/                      # REST controllers
│   │   ├── 📁 dto/                      # Data transfer objects
│   │   ├── 📁 entity/                   # MongoDB entities
│   │   ├── 📁 repository/               # Data access layer
│   │   ├── 📁 service/                  # Business logic
│   │   ├── 📁 jwt/                      # JWT utilities
│   │   ├── 📁 exception/                # Exception handlers
│   │   └── 📁 utility/                  # Utility classes
│   ├── 📁 src/main/resources/
│   │   └── application.properties       # Configuration
│   └── pom.xml                          # Maven dependencies
├── 📁 frontend/                         # React application
│   ├── 📁 src/
│   │   ├── 📁 Components/               # React components
│   │   │   ├── 📁 AI/                   # AI-related components
│   │   │   ├── 📁 Auth/                 # Authentication components
│   │   │   ├── 📁 Job/                  # Job-related components
│   │   │   └── 📁 UI/                   # UI components
│   │   ├── 📁 Pages/                    # Page components
│   │   ├── 📁 Services/                 # API services
│   │   ├── 📁 Slices/                   # Redux slices
│   │   └── 📁 Interceptor/              # HTTP interceptors
│   ├── 📁 public/                       # Static assets
│   └── package.json                     # Node.js dependencies
├── 📁 mongodb/                          # Database initialization
├── 📄 docker-compose.yml                # Container orchestration
├── 📄 env.example                       # Environment template
├── 📄 setup-env.sh                      # Linux/Mac setup script
├── 📄 setup-env.ps1                     # Windows setup script
└── 📄 README.md                         # This file
```

## 🚀 Deployment

### Production Deployment

1. **Environment Configuration**
   ```bash
   # Set production environment
   export SPRING_PROFILES_ACTIVE=prod
   export NODE_ENV=production
   ```

2. **Build and Deploy**
   ```bash
   # Build all services
   docker compose -f docker-compose.prod.yml build

   # Deploy to production
   docker compose -f docker-compose.prod.yml up -d
   ```

3. **SSL Configuration**
   ```bash
   # Add SSL certificates
   cp ssl/cert.pem /etc/ssl/certs/
   cp ssl/key.pem /etc/ssl/private/
   ```

### Monitoring and Logs

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend

# Monitor resource usage
docker stats
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   # Backend tests
   cd backend && mvn test
   
   # Frontend tests
   cd frontend && npm test
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Create a Pull Request**

### Code Style Guidelines

- **Backend**: Follow Spring Boot conventions
- **Frontend**: Use TypeScript, follow React best practices
- **Commits**: Use conventional commit messages
- **Documentation**: Update README and API docs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the amazing UI library
- Mantine team for the beautiful components
- OpenAI, Hugging Face, and Ollama for AI services

---

**Made with ❤️ by the JobPortal Team** 