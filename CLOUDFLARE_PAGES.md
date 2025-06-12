# Cloudflare Pages Configuration

This is a **React frontend application** that should be deployed to **Cloudflare Pages**.

## Build Settings for Cloudflare Pages

```
Framework preset: React
Build command: npm run build
Build output directory: dist
Root directory: (leave empty)
```

## Important Notes

- The `worker/` directory contains a **separate Cloudflare Worker** project
- **Do NOT deploy the worker/** directory with Pages
- The worker should be deployed separately using `wrangler deploy`
- This Pages deployment only includes the React frontend

## Environment Variables

Set in Cloudflare Pages dashboard:
```
VITE_WORKER_URL=https://gospel-reach-me-worker.ng138.workers.dev
```

## Frontend-Only Dependencies

This build only installs and builds the React application dependencies from the root `package.json`. The worker has its own separate dependencies in `worker/package.json`. 