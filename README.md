# 🚀 JobPortal - Modern Job Board Platform

A full-stack job portal application built with Spring Boot, React, and MongoDB. Features AI-powered job description generation, real-time notifications, and a modern user interface. Leverages Docker for containerization, Redis for caching, Kafka for message streaming, and Spring Security for robust authentication and authorization.

## 🛠 Built With

### Backend Technologies
![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.2-green?style=for-the-badge&logo=spring-boot&logoColor=white)
![Spring AI](https://img.shields.io/badge/Spring_AI-1.0.0-green?style=for-the-badge&logo=spring&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6.0-green?style=for-the-badge&logo=spring-security&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0+-green?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7.0-red?style=for-the-badge&logo=redis&logoColor=white)
![Apache Kafka](https://img.shields.io/badge/Apache_Kafka-3.0-black?style=for-the-badge&logo=apache-kafka&logoColor=white)

### Frontend Technologies
![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-1.9-purple?style=for-the-badge&logo=redux&logoColor=white)
![Mantine UI](https://img.shields.io/badge/Mantine_UI-7.0-blue?style=for-the-badge&logo=mantine&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Infrastructure & Tools
![Docker](https://img.shields.io/badge/Docker-24.0-blue?style=for-the-badge&logo=docker&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker_Compose-2.0-blue?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-1.24-green?style=for-the-badge&logo=nginx&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-3.8+-orange?style=for-the-badge&logo=apache-maven&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18.0-green?style=for-the-badge&logo=node.js&logoColor=white)

### AI Services
![OpenAI](https://img.shields.io/badge/OpenAI-GPT_3.5-412991?style=for-the-badge&logo=openai&logoColor=white)
![Hugging Face](https://img.shields.io/badge/Hugging_Face-Transformers-yellow?style=for-the-badge&logo=huggingface&logoColor=black)
![Ollama](https://img.shields.io/badge/Ollama-Local_AI-FF6B6B?style=for-the-badge&logo=ollama&logoColor=white)

### Development Tools
![Git](https://img.shields.io/badge/Git-2.30+-orange?style=for-the-badge&logo=git&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-1.80-blue?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![IntelliJ IDEA](https://img.shields.io/badge/IntelliJ_IDEA-2023.1-black?style=for-the-badge&logo=intellij-idea&logoColor=white)

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Environment Setup](#-environment-setup)

- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)


## ✨ Features

### 🎯 Core Functionality
- **User Authentication & Authorization** - JWT-based secure authentication
- **Job Posting & Management** - Create, edit, and manage job listings
- **Job Search & Filtering** - Advanced search with multiple criteria
- **Application System** - Apply to jobs with resume and cover letter
- **Real-time Notifications** - WebSocket-based instant notifications
- **AI-Powered Job Descriptions** - Generate professional job descriptions using AI

### 🤖 AI Integration
- **Spring AI Framework** - Native Spring Boot AI integration
- **Multi-AI Provider Support** - OpenAI, Hugging Face, Ollama
- **Smart Job Description Generation** - Context-aware content creation
- **SEO Optimization** - AI-generated keywords and descriptions
- **Content Validation** - AI-powered content quality checks
- **Dynamic Prompt Engineering** - Flexible AI prompt generation

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
- **Spring AI** - AI integration framework for Spring applications
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
- **Spring AI** - Native Spring Boot AI integration framework
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
                         │ (Spring AI +    │
                         │  OpenAI/HF/etc) │
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
- `POST /api/ai/generate-description` - Generate job description using Spring AI
- `POST /api/ai/optimize` - Optimize existing description
- `POST /api/ai/validate` - Validate content
- `POST /api/ai/seo-keywords` - Generate SEO keywords

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