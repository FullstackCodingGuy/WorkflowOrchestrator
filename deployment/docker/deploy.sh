#!/bin/bash

# Docker Deployment Script for Workflow Orchestrator

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🐳 Starting Docker Deployment for Workflow Orchestrator${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker is not running. Please start Docker.${NC}"
    exit 1
fi

# Build the Docker image
echo -e "${YELLOW}📦 Building Docker image...${NC}"
docker build -f deployment/docker/Dockerfile -t workflow-orchestrator:latest .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Docker build failed!${NC}"
    exit 1
fi

# Stop existing container if running
echo -e "${YELLOW}🛑 Stopping existing container...${NC}"
docker stop workflow-orchestrator 2>/dev/null || true
docker rm workflow-orchestrator 2>/dev/null || true

# Run the container
echo -e "${YELLOW}🚀 Starting new container...${NC}"
docker run -d \
  --name workflow-orchestrator \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_APP_NAME="Workflow Orchestrator" \
  -e NEXT_PUBLIC_APP_VERSION="1.0.0" \
  -e NEXT_PUBLIC_ENVIRONMENT="production" \
  --restart unless-stopped \
  workflow-orchestrator:latest

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Container started successfully!${NC}"
    echo -e "${YELLOW}🌍 Application URL: http://localhost:3000${NC}"
    echo -e "${YELLOW}📊 Container logs: docker logs workflow-orchestrator${NC}"
    echo -e "${YELLOW}🛑 Stop container: docker stop workflow-orchestrator${NC}"
else
    echo -e "${RED}❌ Failed to start container!${NC}"
    exit 1
fi

# Show container status
echo -e "${YELLOW}📊 Container status:${NC}"
docker ps | grep workflow-orchestrator
