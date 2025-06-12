# Gospel Reach Me

**Multi-language Bible verse delivery platform** - Share the Gospel through beautiful, randomly selected Bible verses in 5 languages.

## 🌟 Features

- **5 Languages**: English, French, German, Spanish, Italian
- **11 Bible Versions**: Multiple translations per language
- **5,500+ Verses**: Curated collection of inspirational Bible verses
- **Beautiful UI**: Modern, responsive design with background images
- **Global Analytics**: Simulated worldwide usage statistics
- **Geo-location**: Automatic language detection based on location
- **Pure Frontend**: No backend required - runs entirely in the browser

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

## 📦 Deployment

This is a **pure frontend application** that can be deployed to any static hosting service:

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

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data**: JSON files (included in build)

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
