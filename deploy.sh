#!/bin/bash

# JobPortal Deployment Script
# This script automates the deployment process for the JobPortal application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "Docker and Docker Compose are installed."
}

# Check if .env file exists
check_env_file() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from template..."
        if [ -f "env.production.example" ]; then
            cp env.production.example .env
            print_status ".env file created from template. Please edit it with your production values."
            print_warning "You need to edit the .env file before continuing."
            exit 1
        else
            print_error "No .env template found. Please create a .env file manually."
            exit 1
        fi
    fi
    print_status ".env file found."
}

# Stop existing containers
stop_containers() {
    print_status "Stopping existing containers..."
    docker-compose down --remove-orphans || true
}

# Build and start containers
deploy_application() {
    local compose_file=${1:-"docker-compose.yml"}
    
    print_status "Building and starting containers using $compose_file..."
    
    # Build images
    docker-compose -f $compose_file build --no-cache
    
    # Start services
    docker-compose -f $compose_file up -d
    
    print_status "Containers started successfully."
}

# Wait for services to be healthy
wait_for_services() {
    print_status "Waiting for services to be healthy..."
    
    # Wait for MongoDB
    print_status "Waiting for MongoDB..."
    timeout 60 bash -c 'until docker-compose exec -T mongodb mongosh --eval "db.adminCommand(\"ping\")" > /dev/null 2>&1; do sleep 2; done' || {
        print_error "MongoDB failed to start within 60 seconds"
        exit 1
    }
    
    # Wait for Redis
    print_status "Waiting for Redis..."
    timeout 30 bash -c 'until docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; do sleep 2; done' || {
        print_error "Redis failed to start within 30 seconds"
        exit 1
    }
    
    # Wait for Backend
    print_status "Waiting for Backend..."
    timeout 120 bash -c 'until curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; do sleep 5; done' || {
        print_error "Backend failed to start within 120 seconds"
        exit 1
    }
    
    # Wait for Frontend
    print_status "Waiting for Frontend..."
    timeout 60 bash -c 'until curl -f http://localhost:80 > /dev/null 2>&1; do sleep 5; done' || {
        print_error "Frontend failed to start within 60 seconds"
        exit 1
    }
    
    print_status "All services are healthy!"
}

# Check service status
check_status() {
    print_status "Checking service status..."
    docker-compose ps
    
    print_status "Checking service logs..."
    docker-compose logs --tail=20
}

# Main deployment function
main() {
    local environment=${1:-"dev"}
    local compose_file="docker-compose.yml"
    
    if [ "$environment" = "prod" ]; then
        compose_file="docker-compose.prod.yml"
    fi
    
    print_status "Starting deployment for $environment environment..."
    
    # Pre-deployment checks
    check_docker
    check_env_file
    
    # Stop existing containers
    stop_containers
    
    # Deploy application
    deploy_application $compose_file
    
    # Wait for services
    wait_for_services
    
    # Check status
    check_status
    
    print_status "Deployment completed successfully!"
    print_status "Application is available at: http://localhost:80"
    print_status "API is available at: http://localhost:8080"
    
    if [ "$environment" = "prod" ]; then
        print_warning "Remember to:"
        print_warning "1. Configure your domain in the .env file"
        print_warning "2. Set up SSL certificates"
        print_warning "3. Configure firewall rules"
        print_warning "4. Set up monitoring and backups"
    fi
}

# Show usage
usage() {
    echo "Usage: $0 [dev|prod]"
    echo "  dev  - Deploy development environment (default)"
    echo "  prod - Deploy production environment"
    echo ""
    echo "Examples:"
    echo "  $0        # Deploy development environment"
    echo "  $0 dev    # Deploy development environment"
    echo "  $0 prod   # Deploy production environment"
}

# Parse command line arguments
case "${1:-dev}" in
    "dev"|"development")
        main "dev"
        ;;
    "prod"|"production")
        main "prod"
        ;;
    "help"|"-h"|"--help")
        usage
        ;;
    *)
        print_error "Invalid environment: $1"
        usage
        exit 1
        ;;
esac
