# AWS Deployment Guide

## Prerequisites
1. Install AWS CLI: `brew install awscli` or download from AWS
2. Configure AWS credentials: `aws configure`
3. Ensure you have appropriate IAM permissions for S3 and CloudFront

## Deployment Options

### Option 1: Automated Script
```bash
# Make script executable
chmod +x deployment/aws/deploy.sh

# Run deployment
./deployment/aws/deploy.sh
```

### Option 2: Manual Steps

#### 1. Build Static Export
```bash
export NEXT_EXPORT=true
npm run build:static
```

#### 2. Create S3 Bucket
```bash
BUCKET_NAME="workflow-orchestrator-app"
REGION="us-east-1"

aws s3 mb s3://$BUCKET_NAME --region $REGION
```

#### 3. Configure Static Website Hosting
```bash
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html
```

#### 4. Apply Bucket Policy
```bash
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://deployment/aws/s3-bucket-policy.json
```

#### 5. Upload Files
```bash
aws s3 sync out/ s3://$BUCKET_NAME --delete
```

## CloudFront Setup (Optional but Recommended)

### 1. Create Distribution
```bash
aws cloudfront create-distribution --distribution-config file://deployment/aws/cloudfront-config.json
```

### 2. Update Script
Edit `deploy.sh` and add your CloudFront distribution ID for cache invalidation.

## Custom Domain
1. Create Route 53 hosted zone
2. Point CloudFront distribution to your domain
3. Update DNS records

## Performance Features
- ✅ Global CDN (CloudFront)
- ✅ S3 Static Hosting
- ✅ Custom Caching Rules
- ✅ GZIP Compression
- ✅ Custom Domain Support

## Cost Estimation
- **S3**: ~$0.023/GB storage + $0.004/10k requests
- **CloudFront**: ~$0.085/GB transfer + $0.0075/10k requests
- **Route 53**: ~$0.50/hosted zone/month

## Monitoring
Use AWS CloudWatch for monitoring:
- S3 bucket metrics
- CloudFront performance
- Cost tracking
