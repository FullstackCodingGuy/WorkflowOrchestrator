# Vercel Deployment Guide

## Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`

## Deployment Steps

### 1. Setup Vercel Configuration
```bash
# Copy Vercel config to root
cp deployment/vercel/vercel.json ./

# Copy environment variables
cp deployment/vercel/.env.production ./.env.production
```

### 2. Deploy
```bash
# Preview deployment
npm run deploy:preview

# Production deployment
npm run deploy:vercel
```

### 3. Environment Variables (in Vercel Dashboard)
- `NEXT_PUBLIC_APP_NAME`: Workflow Orchestrator
- `NEXT_PUBLIC_APP_VERSION`: 1.0.0
- `NEXT_PUBLIC_ENVIRONMENT`: production

## Custom Domain
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Rollback
```bash
vercel rollback [deployment-url]
```

## Performance Features
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Image Optimization
- ✅ Edge Functions
- ✅ Analytics
- ✅ Core Web Vitals Monitoring
