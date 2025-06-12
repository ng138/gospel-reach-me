# Gospel Reach Me - Cloudflare Deployment Guide

## 🏗 Architecture Overview

- **Code Repository**: GitHub (https://github.com/ng138/gospel-reach-me)
- **Frontend Hosting**: Cloudflare Pages
- **Backend API**: Cloudflare Workers
- **Data Storage**: Cloudflare KV + R2

## 🚀 Frontend Deployment (Cloudflare Pages)

### Step 1: Connect GitHub to Cloudflare Pages

1. **Login to Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to "Pages" section

2. **Create New Project**
   - Click "Create a project"
   - Choose "Connect to Git"
   - Select "GitHub" and authorize Cloudflare

3. **Select Repository**
   - Choose: `ng138/gospel-reach-me`
   - Branch: `main`

4. **Configure Build Settings**
   ```
   Framework preset: React
   Build command: npm run build
   Build output directory: dist
   Root directory: (leave empty)
   ```

5. **Environment Variables**
   - Add: `VITE_WORKER_URL` = `https://gospel-reach-me-worker.ng138.workers.dev`

6. **Deploy**
   - Click "Save and Deploy"
   - Your site will be available at: `https://gospel-reach-me.pages.dev`

### Custom Domain (Optional)
- Add your custom domain in Cloudflare Pages settings
- Example: `gospelreach.me` or `gospel.yourdomain.com`

## ⚡ Backend Deployment (Cloudflare Workers)

### Step 1: Setup Cloudflare Account
1. Get your **Account ID** from Cloudflare Dashboard
2. Create **API Token** with Workers permissions:
   - Go to "My Profile" > "API Tokens"
   - Create Custom Token:
     - Permissions: `Account:Cloudflare Workers:Edit`
     - Account Resources: Include your account

### Step 2: Configure Worker
1. **Update worker/wrangler.toml**:
   ```toml
   name = "gospel-reach-me-worker"
   account_id = "your_account_id_here"
   compatibility_date = "2024-01-15"
   ```

2. **Install Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

3. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

### Step 3: Create KV Namespaces
```bash
cd worker
wrangler kv:namespace create "BIBLE_VERSES"
wrangler kv:namespace create "USER_DATA" 
wrangler kv:namespace create "GLOBAL_STATS"
```

Add the namespace IDs to `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "BIBLE_VERSES"
id = "your_bible_verses_namespace_id"

[[kv_namespaces]]
binding = "USER_DATA"
id = "your_user_data_namespace_id"

[[kv_namespaces]]
binding = "GLOBAL_STATS"
id = "your_global_stats_namespace_id"
```

### Step 4: Setup R2 Storage (Optional)
```bash
wrangler r2 bucket create gospel-reach-media
```

### Step 5: Deploy Worker
```bash
cd worker
wrangler deploy
```

Your worker will be available at: `https://gospel-reach-me-worker.ng138.workers.dev`

## 🔄 Automatic Deployments

### Frontend Auto-Deploy
- Cloudflare Pages automatically deploys when you push to GitHub `main` branch
- No additional configuration needed

### Worker Auto-Deploy (Optional)
You can set up GitHub Actions for worker deployment:

1. **Add GitHub Secrets**:
   - `CLOUDFLARE_API_TOKEN`: Your API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your account ID

2. **Create `.github/workflows/deploy-worker.yml`**:
   ```yaml
   name: Deploy Worker
   on:
     push:
       branches: [main]
       paths: ['worker/**']
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
         - name: Deploy Worker
           env:
             CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
           run: |
             cd worker
             npx wrangler deploy
   ```

## 🛠 Development Workflow

### Local Development
```bash
# Frontend
npm run dev

# Worker (separate terminal)
cd worker
wrangler dev
```

### Testing
```bash
# Build frontend
npm run build

# Preview frontend
npm run preview

# Test worker locally
cd worker
wrangler dev --local
```

## 📊 Monitoring

### Cloudflare Dashboard
- **Pages**: Deployment logs and analytics
- **Workers**: Request metrics and logs
- **Analytics**: Traffic and performance data

### Live URLs
- **Frontend**: https://gospel-reach-me.pages.dev
- **Worker**: https://gospel-reach-me-worker.ng138.workers.dev
- **GitHub**: https://github.com/ng138/gospel-reach-me

## 🔧 Configuration Files

### Frontend Environment Variables
Create `.env.local` for local development:
```env
VITE_WORKER_URL=http://localhost:8787
```

### Worker Configuration
Update `worker/wrangler.toml` with your specific settings:
- Account ID
- KV namespace IDs  
- R2 bucket name
- Custom domain (if any)

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are installed: `npm ci`

2. **Worker Deployment Issues**
   - Verify API token permissions
   - Check account ID in wrangler.toml
   - Ensure KV namespaces are created

3. **CORS Errors**
   - Worker CORS headers are configured in `worker/src/index.js`
   - Verify allowed origins include your Pages domain

4. **Environment Variables**
   - Frontend: Use `VITE_` prefix for Vite variables
   - Worker: Set in Cloudflare Dashboard or wrangler.toml

### Getting Help
- Check Cloudflare Workers docs: https://developers.cloudflare.com/workers/
- GitHub Issues: https://github.com/ng138/gospel-reach-me/issues 