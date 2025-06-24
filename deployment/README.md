# 🚀 Multi-Platform Deployment Guide

## Overview
This project supports deployment to multiple hosting platforms with optimized configurations for each.

## 📁 Deployment Structure
```
deployment/
├── vercel/          # Vercel (recommended)
├── netlify/         # Netlify static hosting
├── aws/             # AWS S3 + CloudFront
└── docker/          # Docker containerization
```

## 🎯 Platform Comparison

| Platform | Cost | Complexity | Performance | Best For |
|----------|------|------------|-------------|----------|
| **Vercel** | Free/Pro | ⭐ Easy | ⭐⭐⭐⭐⭐ | Next.js apps, instant deploy |
| **Netlify** | Free/Pro | ⭐⭐ Easy | ⭐⭐⭐⭐ | Static sites, forms |
| **AWS** | Pay-as-go | ⭐⭐⭐ Medium | ⭐⭐⭐⭐⭐ | Enterprise, custom domains |
| **Docker** | Hosting cost | ⭐⭐⭐⭐ Complex | ⭐⭐⭐⭐ | Self-hosting, full control |

## 🔧 Quick Start

### For Vercel (Recommended)
```bash
# 1. Copy config
cp deployment/vercel/vercel.json ./

# 2. Deploy
npm run deploy:vercel
```

### For Netlify
```bash
# 1. Copy config
cp deployment/netlify/netlify.toml ./

# 2. Deploy
npm run deploy:netlify
```

### For AWS
```bash
# Run automated script
./deployment/aws/deploy.sh
```

### For Docker
```bash
# Run automated script
./deployment/docker/deploy.sh
```

## 📋 Pre-Deployment Checklist

- [ ] Project builds successfully (`npm run build`)
- [ ] All tests pass (`npm run lint`)
- [ ] Environment variables configured
- [ ] Custom domain prepared (if needed)
- [ ] SSL certificates ready (if self-hosting)

## 🔄 Platform Migration

### From Vercel to Netlify
1. Copy Netlify config: `cp deployment/netlify/netlify.toml ./`
2. Set environment: `export NEXT_EXPORT=true`
3. Build static: `npm run build:static`
4. Deploy: `npm run deploy:netlify`

### From Any Platform to Docker
1. Build image: `docker build -f deployment/docker/Dockerfile -t workflow-orchestrator .`
2. Run container: `./deployment/docker/deploy.sh`

## 🛠️ Configuration Management

### Environment Variables
Each platform uses specific environment variables:

**Common Variables:**
- `NEXT_PUBLIC_APP_NAME`: Application name
- `NEXT_PUBLIC_APP_VERSION`: Version number
- `NEXT_PUBLIC_ENVIRONMENT`: Environment (production/staging)

**Platform-Specific:**
- `VERCEL=1`: Vercel optimizations
- `NETLIFY=true`: Netlify static export
- `NEXT_EXPORT=true`: Static export mode
- `AWS_REGION`: AWS region

### Next.js Configuration
The `next.config.ts` automatically detects the deployment platform and applies appropriate optimizations:

- **Vercel**: Standalone output, server optimizations
- **Netlify**: Static export, image optimization disabled
- **AWS**: Static export with S3 compatibility
- **Docker**: Standalone output for containerization

## 📊 Performance Optimization

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

### Performance Testing
```bash
# Test build performance
npm run test:build

# Lighthouse audit
npx lighthouse http://localhost:3000 --view
```

## 🔒 Security Configuration

All platforms include security headers:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 🎯 Platform Selection Guide

### Choose Vercel if:
- ✅ You want the easiest deployment
- ✅ You need automatic previews
- ✅ You value Next.js optimizations
- ✅ You want built-in analytics

### Choose Netlify if:
- ✅ You prefer static hosting
- ✅ You need form handling
- ✅ You want split testing
- ✅ You have existing Netlify projects

### Choose AWS if:
- ✅ You need enterprise features
- ✅ You want full control over infrastructure
- ✅ You have existing AWS setup
- ✅ You need custom compliance requirements

### Choose Docker if:
- ✅ You want self-hosting
- ✅ You need custom runtime environment
- ✅ You have existing container infrastructure
- ✅ You want maximum flexibility

## 📞 Support & Troubleshooting

### Common Issues

**Build Failures:**
1. Check Node.js version (>=18 required)
2. Clear cache: `rm -rf .next node_modules && npm install`
3. Check environment variables

**Static Export Issues:**
1. Ensure `NEXT_EXPORT=true` is set
2. Check for dynamic imports
3. Verify image optimization is disabled

**Docker Issues:**
1. Check Docker is running
2. Verify Dockerfile syntax
3. Check resource limits

### Getting Help
1. Check platform-specific README in deployment folders
2. Review build logs for specific errors
3. Test locally before deploying
4. Use platform-specific support channels

## 🔄 Rollback Procedures

### Vercel
```bash
vercel rollback [deployment-url]
```

### Netlify
Use dashboard → Deploys → Previous deploy → Publish

### AWS
```bash
aws s3 sync backup/ s3://bucket-name --delete
```

### Docker
```bash
docker run previous-image-tag
```

---

**Choose your platform and follow the specific guide in the respective deployment folder!**
