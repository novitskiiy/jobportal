#!/bin/bash

# JobPortal Deployment Script
# This script automates the deployment process for the JobPortal application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    print_step "Checking Docker installation..."
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

# Check if .env file exists and validate it
check_env_file() {
    print_step "Checking environment configuration..."
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
    
    # Validate required environment variables
    source .env
    required_vars=("JWT_SECRET" "EMAIL_HOST" "EMAIL_USERNAME" "EMAIL_PASSWORD" "REACT_APP_API_URL" "REACT_APP_WS_URL")
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ] || [ "${!var}" = "your-production-*" ]; then
            print_error "Missing or invalid environment variable: $var"
            print_warning "Please update your .env file with proper values."
            exit 1
        fi
    done
    
    print_status ".env file is valid."
}

# Stop existing containers
stop_containers() {
    print_step "Stopping existing containers..."
    docker-compose down --remove-orphans || true
    print_status "Existing containers stopped."
}

# Clean up Docker resources
cleanup_docker() {
    print_step "Cleaning up Docker resources..."
    docker system prune -f || true
    docker volume prune -f || true
    print_status "Docker cleanup completed."
}

# Build and start containers
deploy_application() {
    local compose_file=${1:-"docker-compose.yml"}
    
    print_step "Building and starting containers using $compose_file..."
    
    # Build images with no cache
    print_status "Building Docker images..."
    docker-compose -f $compose_file build --no-cache
    
    # Start services
    print_status "Starting services..."
    docker-compose -f $compose_file up -d
    
    print_status "Containers started successfully."
}

# Wait for services to be ready
wait_for_services() {
    print_step "Waiting for services to be ready..."
    
    # Wait for infrastructure services first
    print_status "Waiting for MongoDB..."
    sleep 10
    
    print_status "Waiting for Redis..."
    sleep 5
    
    print_status "Waiting for Kafka..."
    sleep 10
    
    print_status "Waiting for Backend..."
    sleep 15
    
    print_status "Waiting for Frontend..."
    sleep 10
    
    print_status "All services should be running!"
}

# Check service status and logs
check_status() {
    print_step "Checking service status..."
    
    # Check container status
    print_status "Container status:"
    docker-compose -f $compose_file ps
    
    # Check if all containers are running
    local running_containers=$(docker-compose -f $compose_file ps -q | wc -l)
    local total_containers=$(docker-compose -f $compose_file config --services | wc -l)
    
    if [ "$running_containers" -eq "$total_containers" ]; then
        print_status "All containers are running!"
    else
        print_warning "Some containers may not be running properly."
        print_status "Checking logs for failed containers..."
        docker-compose -f $compose_file logs --tail=20
    fi
}

# Test application endpoints
test_endpoints() {
    print_step "Testing application endpoints..."
    
    # Test frontend
    if curl -f -s http://localhost:80/health > /dev/null; then
        print_status "Frontend is accessible"
    else
        print_warning "Frontend may not be ready yet"
    fi
    
    # Test backend
    if curl -f -s http://localhost:8080/actuator/health > /dev/null; then
        print_status "Backend is accessible"
    else
        print_warning "Backend may not be ready yet"
    fi
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
    
    # Clean up Docker resources
    cleanup_docker
    
    # Deploy application
    deploy_application $compose_file
    
    # Wait for services
    wait_for_services
    
    # Check status
    check_status
    
    # Test endpoints
    test_endpoints
    
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
