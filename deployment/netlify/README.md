# Netlify Deployment Guide

## Prerequisites
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Login to Netlify: `netlify login`

## Deployment Steps

### 1. Setup Netlify Configuration
```bash
# Copy Netlify config to root
cp deployment/netlify/netlify.toml ./

# Copy environment variables
cp deployment/netlify/.env.production ./.env.production
```

### 2. Build for Static Export
```bash
# Set environment for static export
export NEXT_EXPORT=true

# Build static version
npm run build:static
```

### 3. Deploy
```bash
# Preview deployment
netlify deploy --dir=out

# Production deployment
npm run deploy:netlify
```

### 4. Environment Variables (in Netlify Dashboard)
- `NEXT_PUBLIC_APP_NAME`: Workflow Orchestrator
- `NEXT_PUBLIC_APP_VERSION`: 1.0.0
- `NEXT_PUBLIC_ENVIRONMENT`: production
- `NEXT_EXPORT`: true
- `NETLIFY`: true

## Custom Domain
1. Go to Netlify Dashboard → Site → Domain Settings
2. Add custom domain
3. Update DNS records

## Performance Features
- ✅ Global CDN
- ✅ Form Handling
- ✅ Split Testing
- ✅ Analytics
- ✅ Edge Functions
- ✅ Automatic HTTPS

## Rollback
Use Netlify Dashboard → Deploys → Previous Deploy → Publish
