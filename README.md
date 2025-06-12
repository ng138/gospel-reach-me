# Gospel Reach Me Web Application

A web application designed to deliver Bible verses and track global engagement through NFC tags.

## Features

- Automatic language detection with support for 5 languages (EN, FR, IT, ES, DE)
- Dynamic Bible verse display with version switching
- Real-time global counter and country-based activation map
- Anonymous user tracking with voluntary name submission
- Randomized full-screen background photos
- Mobile-first responsive design optimized for NFC tag scanning
- Google AdSense integration for monetization

## Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Cloudflare Workers (serverless)
- **Storage**: Cloudflare KV (for Bible verses and user data), Cloudflare R2 (for media)
- **Real-time Counter**: Cloudflare Durable Objects
- **Security**: Cloudflare Turnstile (CAPTCHA alternative)

## Project Structure

- `/src`: Frontend React application
  - `/components`: UI components
  - `/hooks`: Custom React hooks
  - `/services`: API service layer
  - `/types`: TypeScript type definitions
- `/worker`: Cloudflare Worker code
  - `/src`: Worker source code
  - `wrangler.toml`: Worker configuration

## Development

### Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. For Worker development, use Wrangler:
   ```
   npx wrangler dev worker/src/index.js
   ```

### Deployment

The frontend and Worker are deployed separately:

1. **Frontend** (Cloudflare Pages):
   ```
   npm run build
   ```
   Then deploy the `dist` directory to Cloudflare Pages.

2. **Worker** (Cloudflare Workers):
   ```
   cd worker
   npx wrangler deploy
   ```

## Required Cloudflare Resources

- Two KV namespaces (bible_text_kv, user_submissions_kv)
- One R2 bucket (background_media_r2)
- Durable Object namespace (automatically created on deploy)
- Turnstile site key and secret key

## Environment Variables

- `TURNSTILE_SECRET_KEY`: Secret key for Cloudflare Turnstile verification

## Data Loading

Before the application can function correctly, you need to:

1. Load Bible verses into the `BIBLE_TEXT_KV` namespace
2. Upload background images to the `BACKGROUND_MEDIA_R2` bucket

## License

All rights reserved. © 2025 Gospel Reach Me