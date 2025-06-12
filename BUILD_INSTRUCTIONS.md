# Build Instructions for Cloudflare Pages

## ⚠️ IMPORTANT: This is a React Frontend Project

**This repository contains ONLY the frontend React application.**

### Cloudflare Pages Configuration

Use these **exact settings** in Cloudflare Pages:

```
Project Type: Frontend (React/Vite)
Framework preset: React
Build command: npm run build
Build output directory: dist
Root directory: (leave empty)
Node.js version: 18.x or 20.x
```

### Environment Variables

Set in Cloudflare Pages dashboard:
```
VITE_WORKER_URL=https://gospel-reach-me-worker.ng138.workers.dev
```

### ❌ Do NOT use Wrangler

- This project should **NOT** be deployed using `wrangler deploy`
- This is **NOT** a Cloudflare Worker project
- The `worker/` directory is ignored and should not be deployed with Pages

### ✅ Expected Build Process

1. `npm clean-install` - Install React dependencies
2. `tsc` - TypeScript compilation
3. `vite build` - Bundle React app for production
4. Deploy `dist/` folder to Cloudflare Pages CDN

### If Build Fails

If Cloudflare tries to run Wrangler commands:
1. Check that Framework is set to "React" 
2. Verify Build command is exactly: `npm run build`
3. Ensure no custom deploy commands are set
4. Contact support if Pages keeps trying to deploy as Worker 