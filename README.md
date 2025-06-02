# Job Portal Application

Full-stack job portal application built with Spring Boot, React, and MongoDB.

## Prerequisites

- Docker Desktop
- Git

## Project Structure

```
jobportal/
├── backend/         # Spring Boot application
├── frontend/        # React application
├── mongodb/         # MongoDB initialization scripts
└── docker-compose.yml
```

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd jobportal
```

2. Start the application:
```bash
docker compose up --build
```

3. Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:8080
- MongoDB: localhost:27017

## Development

### Backend (Spring Boot)
- Java 17
- Spring Boot 3.x
- MongoDB

### Frontend (React)
- React 18
- TypeScript
- Tailwind CSS

### Database
- MongoDB 8.x

## API Documentation

Backend API endpoints:

- POST /users/register - Register new user
- POST /users/login - User login
- GET /users - Get all users (admin only)
- More endpoints documentation coming soon...

## Stopping the Application

```bash
docker compose down
```

To remove all data (including database):
```bash
docker compose down -v
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 