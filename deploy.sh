#!/bin/bash

# FULLSCO Backend Deployment Script
# This script automates the deployment process for the FULLSCO backend

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found. Please create one based on env.example"
    exit 1
fi

# Load environment variables
print_status "Loading environment variables..."
source .env

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to build and deploy
deploy() {
    print_status "Starting deployment process..."
    
    # Check Docker
    check_docker
    
    # Stop existing containers
    print_status "Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down --remove-orphans || true
    
    # Build and start services
    print_status "Building and starting services..."
    docker-compose -f docker-compose.prod.yml up -d --build
    
    # Wait for services to be healthy
    print_status "Waiting for services to be healthy..."
    sleep 30
    
    # Check if services are running
    if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        print_success "Services are running successfully"
    else
        print_error "Some services failed to start"
        docker-compose -f docker-compose.prod.yml logs
        exit 1
    fi
    
    # Run database migrations
    print_status "Running database migrations..."
    docker-compose -f docker-compose.prod.yml exec -T backend npm run db:migrate || {
        print_warning "Migration failed, but continuing..."
    }
    
    print_success "Deployment completed successfully!"
    print_status "Backend is available at: http://localhost:${PORT:-5000}"
    print_status "Health check: http://localhost:${PORT:-5000}/health"
}

# Function to deploy with database seeding
deploy_with_seed() {
    print_status "Deploying with database seeding..."
    
    # Deploy normally first
    deploy
    
    # Run database seeding
    print_status "Running database seeding..."
    docker-compose -f docker-compose.prod.yml exec -T backend npm run db:seed || {
        print_warning "Seeding failed, but continuing..."
    }
    
    print_success "Deployment with seeding completed!"
}

# Function to show logs
show_logs() {
    print_status "Showing logs..."
    docker-compose -f docker-compose.prod.yml logs -f
}

# Function to stop services
stop_services() {
    print_status "Stopping services..."
    docker-compose -f docker-compose.prod.yml down
    print_success "Services stopped"
}

# Function to show status
show_status() {
    print_status "Service status:"
    docker-compose -f docker-compose.prod.yml ps
}

# Function to show help
show_help() {
    echo "FULLSCO Backend Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy      Deploy the application"
    echo "  seed        Deploy with database seeding"
    echo "  logs        Show application logs"
    echo "  stop        Stop all services"
    echo "  status      Show service status"
    echo "  help        Show this help message"
    echo ""
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        deploy
        ;;
    "seed")
        deploy_with_seed
        ;;
    "logs")
        show_logs
        ;;
    "stop")
        stop_services
        ;;
    "status")
        show_status
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac 