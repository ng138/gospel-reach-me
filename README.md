# Gospel Reach Me

**Multi-language Bible verse delivery platform** - Share the Gospel through beautiful, randomly selected Bible verses in 5 languages.

## 🌟 Features

- **5 Languages**: English, French, German, Spanish, Italian
- **11 Bible Versions**: Multiple translations per language
- **5,500+ Verses**: Curated collection of inspirational Bible verses
- **Audio Playback**: Listen to verses with text-to-speech in all languages
- **Beautiful UI**: Modern, responsive design with background images
- **Global Analytics**: Real-time worldwide usage statistics
- **Geo-location**: Automatic language detection based on location
- **Cloudflare Powered**: Uses Workers, Pages, and Durable Objects

## 🌍 Supported Languages & Versions

| Language | Versions Available |
|----------|-------------------|
| **English** | KJV, NIV, ESV |
| **French** | LSG, BDS |
| **German** | Luther 2017, Elberfelder |
| **Spanish** | RVR60, NVI |
| **Italian** | CEI, Nuova Riveduta |

## 🚀 Quick Start

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎵 Audio Feature

The application includes a built-in audio player that allows users to listen to Bible verses:

- **Text-to-Speech**: Uses Web Speech API for immediate audio playback
- **Multi-language Support**: Works with all 5 supported languages
- **Voice Options**: Male/female voice selection (browser-dependent)
- **Future Ready**: Supports pre-recorded audio files when available

### Audio Implementation Status
- ✅ Web Speech API integration complete
- ✅ FloatingAudioPlayer with play/pause controls
- ✅ Volume and voice selection
- 🔜 Premium pre-recorded audio files (optional upgrade)

## 📦 Deployment

This application uses **Cloudflare's full stack**:

### Cloudflare Pages (Recommended)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically

### Alternative Platforms
- **Vercel**: Zero-config deployment
- **Netlify**: Drag & drop or Git integration
- **GitHub Pages**: Enable in repository settings
- **Any CDN**: Upload the `dist/` folder

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS + Glass Morphism
- **Icons**: Lucide React
- **Audio**: Web Speech API + FloatingAudioPlayer

### Backend (Cloudflare)
- **Hosting**: Cloudflare Pages
- **API**: Cloudflare Workers
- **Database**: Cloudflare D1 (planned)
- **Storage**: Cloudflare R2 (for future audio files)
- **Real-time**: Durable Objects (for global stats)

## 📊 Data Structure

### Bible Verses
- **Location**: `src/data/bible_verses/`
- **Format**: JSON files with verse content, references, and metadata
- **Total**: ~500 verses per version × 11 versions = 5,500+ verses

### Background Images
- **Location**: `src/data/background_media_index.json`
- **Source**: High-quality Unsplash images
- **Topics**: Nature, spiritual, inspirational themes

## 🔧 Configuration

### No Environment Variables Required
This application works out of the box without any configuration. All data is embedded in the build.

### Optional Customization
- Modify verse collections in `src/data/bible_verses/`
- Update background images in `src/data/background_media_index.json`
- Customize styling in `src/index.css`

## 📱 Usage

1. **Visit the application** - Automatic language detection
2. **Read the verse** - Randomly selected from your language
3. **Switch languages** - Use the language switcher
4. **Switch versions** - Choose different Bible translations
5. **Get new verse** - Click refresh for another verse
6. **View analytics** - See simulated global usage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run dev`
5. Submit a pull request

## 📄 License

Copyright (c) 2024 Gospel Reach Me. All rights reserved.

## 🙏 Purpose

Created to share the Gospel and provide daily inspiration through God's Word in multiple languages, making Bible verses accessible to people worldwide.# Gospel Reach Me - Deployment Fix
