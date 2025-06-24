#!/bin/bash

# AWS S3 + CloudFront Deployment Script

# Configuration
BUCKET_NAME="workflow-orchestrator-app"
REGION="us-east-1"
DISTRIBUTION_ID="" # Set after CloudFront creation

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting AWS Deployment for Workflow Orchestrator${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if user is logged in
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Run 'aws configure'${NC}"
    exit 1
fi

# Build the application
echo -e "${YELLOW}📦 Building application for static export...${NC}"
export NEXT_EXPORT=true
npm run build:static

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

# Create S3 bucket
echo -e "${YELLOW}🪣 Creating S3 bucket...${NC}"
aws s3 mb s3://$BUCKET_NAME --region $REGION

# Configure bucket for static website hosting
echo -e "${YELLOW}🌐 Configuring static website hosting...${NC}"
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Apply bucket policy
echo -e "${YELLOW}🔒 Applying bucket policy...${NC}"
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://deployment/aws/s3-bucket-policy.json

# Sync files to S3
echo -e "${YELLOW}📤 Uploading files to S3...${NC}"
aws s3 sync out/ s3://$BUCKET_NAME --delete --cache-control "public,max-age=31536000,immutable" --exclude "*.html"
aws s3 sync out/ s3://$BUCKET_NAME --delete --cache-control "public,max-age=0,must-revalidate" --include "*.html"

# Invalidate CloudFront cache (if distribution exists)
if [ ! -z "$DISTRIBUTION_ID" ]; then
    echo -e "${YELLOW}🔄 Invalidating CloudFront cache...${NC}"
    aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${YELLOW}🌍 Website URL: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com${NC}"

if [ ! -z "$DISTRIBUTION_ID" ]; then
    echo -e "${YELLOW}🚀 CloudFront URL: Check your CloudFront distribution${NC}"
fi
