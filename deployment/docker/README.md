# Docker Deployment Guide

## Prerequisites
1. Install Docker: https://docs.docker.com/get-docker/
2. Install Docker Compose (usually included with Docker Desktop)

## Deployment Options

### Option 1: Automated Script
```bash
# Make script executable
chmod +x deployment/docker/deploy.sh

# Run deployment
./deployment/docker/deploy.sh
```

### Option 2: Manual Docker Commands

#### Build Image
```bash
docker build -f deployment/docker/Dockerfile -t workflow-orchestrator:latest .
```

#### Run Container
```bash
docker run -d \
  --name workflow-orchestrator \
  -p 3000:3000 \
  -e NODE_ENV=production \
  workflow-orchestrator:latest
```

### Option 3: Docker Compose
```bash
# Start with compose
cd deployment/docker
docker-compose up -d

# Stop with compose
docker-compose down
```

## Production Deployment

### With Load Balancer
```bash
# Scale to multiple instances
docker-compose up -d --scale workflow-orchestrator=3
```

### With Custom Environment
```bash
# Create .env file
echo "NODE_ENV=production" > .env
echo "NEXT_PUBLIC_APP_NAME=Workflow Orchestrator" >> .env

# Run with env file
docker run -d --env-file .env -p 3000:3000 workflow-orchestrator:latest
```

## Management Commands

### View Logs
```bash
docker logs workflow-orchestrator
docker logs -f workflow-orchestrator  # Follow logs
```

### Container Management
```bash
# Stop container
docker stop workflow-orchestrator

# Start container
docker start workflow-orchestrator

# Restart container
docker restart workflow-orchestrator

# Remove container
docker rm workflow-orchestrator
```

### Health Check
```bash
# Check container status
docker ps | grep workflow-orchestrator

# Check health
docker exec workflow-orchestrator curl -f http://localhost:3000/
```

## Advanced Configuration

### Custom Port
```bash
docker run -d -p 8080:3000 workflow-orchestrator:latest
```

### Volume Mounting (for logs)
```bash
docker run -d \
  -p 3000:3000 \
  -v /host/logs:/app/logs \
  workflow-orchestrator:latest
```

### Resource Limits
```bash
docker run -d \
  --memory="512m" \
  --cpus="1.0" \
  -p 3000:3000 \
  workflow-orchestrator:latest
```

## Performance Features
- ✅ Multi-stage build (optimized image size)
- ✅ Non-root user for security
- ✅ Health checks
- ✅ Restart policies
- ✅ Resource management
- ✅ Horizontal scaling support

## Security Best Practices
- ✅ Non-root user (nextjs:nodejs)
- ✅ Minimal Alpine Linux base
- ✅ No unnecessary packages
- ✅ Security scanning compatible
- ✅ Environment variable support

## Monitoring
- Use `docker stats` for resource monitoring
- Container logs via `docker logs`
- Health checks for availability
- Custom metrics via application endpoints
