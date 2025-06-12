# Gospel Reach Me - Deployment Guide

## 🚀 Frontend Deployment (GitHub Pages)

The frontend is automatically deployed to GitHub Pages via GitHub Actions when you push to the `main` branch.

### Live URL
Your application is available at: **https://ng138.github.io/gospel-reach-me/**

### Manual Deployment Steps
1. Build the application: `npm run build`
2. The GitHub Action will automatically deploy the `dist/` folder to GitHub Pages
3. Check deployment status at: https://github.com/ng138/gospel-reach-me/actions

## ⚡ Backend Deployment (Cloudflare Workers)

### Prerequisites
1. Cloudflare account
2. Cloudflare API token with Workers permissions

### Setup Steps

#### 1. Get Cloudflare API Token
1. Log in to Cloudflare Dashboard
2. Go to "My Profile" > "API Tokens"
3. Create Custom Token with permissions:
   - Zone: Zone Settings:Edit, Zone:Edit
   - Account: Cloudflare Workers:Edit

#### 2. Add GitHub Secret
1. Go to: https://github.com/ng138/gospel-reach-me/settings/secrets/actions
2. Click "New repository secret"
3. Name: `CLOUDFLARE_API_TOKEN`
4. Value: Your API token

#### 3. Configure Worker
1. Update `worker/wrangler.toml` with your account details
2. Set up Cloudflare KV namespaces for Bible verses
3. Configure R2 bucket for media storage

### Local Development
```bash
# Install Wrangler CLI
npm install -g wrangler

# Navigate to worker directory
cd worker

# Login to Cloudflare
wrangler login

# Deploy
wrangler deploy
```

## 🛠 Environment Configuration

### Frontend Environment Variables
- The frontend uses build-time configuration
- API endpoints are configured in `src/services/apiService.ts`

### Backend Environment Variables
Create a `.env` file in the `worker/` directory:
```
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
```

## 📊 Monitoring & Analytics

### GitHub Actions
- Frontend builds and deployments: https://github.com/ng138/gospel-reach-me/actions
- Build status and logs available in the Actions tab

### Cloudflare Dashboard
- Worker metrics and logs: https://dash.cloudflare.com/
- KV storage usage and R2 media storage statistics

## 🔧 Troubleshooting

### Common Issues

1. **GitHub Pages not updating**
   - Check if GitHub Actions completed successfully
   - Verify the `base` path in `vite.config.ts` matches your repository name

2. **Worker deployment fails**
   - Verify API token has correct permissions
   - Check `wrangler.toml` configuration
   - Ensure KV namespaces are created

3. **CORS issues**
   - Update worker CORS headers in `worker/src/index.js`
   - Verify allowed origins match your GitHub Pages URL

### Support
For issues, please create an issue at: https://github.com/ng138/gospel-reach-me/issues 