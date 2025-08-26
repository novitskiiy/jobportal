#!/bin/bash

# JobPortal Deployment Test Script
# This script tests the deployment and provides detailed diagnostics

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Test Docker containers
test_containers() {
    print_step "Testing Docker containers..."
    
    local compose_file="docker-compose.prod.yml"
    
    # Check if containers are running
    local running=$(docker-compose -f $compose_file ps -q | wc -l)
    local total=$(docker-compose -f $compose_file config --services | wc -l)
    
    print_status "Running containers: $running/$total"
    
    if [ "$running" -eq "$total" ]; then
        print_status "All containers are running!"
    else
        print_warning "Some containers are not running."
        docker-compose -f $compose_file ps
    fi
}

# Test network connectivity
test_network() {
    print_step "Testing network connectivity..."
    
    # Test MongoDB
    if docker exec mongodb-prod mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        print_status "MongoDB is accessible"
    else
        print_warning "MongoDB may not be ready"
    fi
    
    # Test Redis
    if docker exec redis-prod redis-cli ping > /dev/null 2>&1; then
        print_status "Redis is accessible"
    else
        print_warning "Redis may not be ready"
    fi
    
    # Test Kafka
    if docker exec kafka-prod kafka-topics --bootstrap-server localhost:9092 --list > /dev/null 2>&1; then
        print_status "Kafka is accessible"
    else
        print_warning "Kafka may not be ready"
    fi
}

# Test application endpoints
test_endpoints() {
    print_step "Testing application endpoints..."
    
    # Test frontend health
    if curl -f -s http://localhost:80/health > /dev/null; then
        print_status "Frontend health endpoint is accessible"
    else
        print_warning "Frontend health endpoint is not accessible"
    fi
    
    # Test frontend main page
    if curl -f -s http://localhost:80 > /dev/null; then
        print_status "Frontend main page is accessible"
    else
        print_warning "Frontend main page is not accessible"
    fi
    
    # Test backend health
    if curl -f -s http://localhost:8080/actuator/health > /dev/null; then
        print_status "Backend health endpoint is accessible"
    else
        print_warning "Backend health endpoint is not accessible"
    fi
    
    # Test backend API
    if curl -f -s http://localhost:8080/api > /dev/null; then
        print_status "Backend API is accessible"
    else
        print_warning "Backend API is not accessible"
    fi
}

# Check logs for errors
check_logs() {
    print_step "Checking logs for errors..."
    
    local compose_file="docker-compose.prod.yml"
    
    # Check for error patterns in logs
    local error_count=$(docker-compose -f $compose_file logs 2>&1 | grep -i "error\|exception\|failed" | wc -l)
    
    if [ "$error_count" -eq 0 ]; then
        print_status "No obvious errors found in logs"
    else
        print_warning "Found $error_count potential errors in logs"
        print_status "Recent logs:"
        docker-compose -f $compose_file logs --tail=50
    fi
}

# Test database connectivity
test_database() {
    print_step "Testing database connectivity..."
    
    # Test MongoDB connection
    if docker exec mongodb-prod mongosh jobportal --eval "db.stats()" > /dev/null 2>&1; then
        print_status "MongoDB database is accessible"
    else
        print_warning "MongoDB database may not be accessible"
    fi
}

# Main test function
main() {
    print_status "Starting deployment test..."
    
    test_containers
    test_network
    test_endpoints
    test_database
    check_logs
    
    print_status "Deployment test completed!"
    print_status "If all tests passed, your application should be working correctly."
}

# Run tests
main
