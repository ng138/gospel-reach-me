# Changelog

All notable changes to the Gospel Reach Me project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Web Speech API integration for audio playback
- TTS (Text-to-Speech) service module (`src/services/ttsService.ts`)
- Enhanced FloatingAudioPlayer with dual audio support (Web Speech + pre-recorded)
- Automatic fallback to Web Speech when audio files are unavailable
- Support for all 5 languages in text-to-speech
- Male/female voice selection for Web Speech (browser-dependent)
- Audio status indicators in the floating player
- Prayer Wall implementation plan documentation
- Comprehensive audio implementation status documentation

### Changed
- FloatingAudioPlayer now supports both Web Speech API and pre-recorded audio
- Updated App.tsx to pass verse text and reference to audio player
- Enhanced audio player UI to show appropriate controls based on audio type
- Progress bar and time display only shown for pre-recorded audio
- Updated README.md with audio feature documentation
- Updated DEPLOYMENT.md with audio configuration details

### Technical Details
- Created modular TTS service with language mapping
- Implemented smart fallback logic for audio playback
- Added voice preloading for better performance
- Proper cleanup of speech synthesis on component unmount
- Browser compatibility handling for Web Speech API

### Infrastructure
- Prepared for future Cloudflare D1 database integration
- Updated wrangler.toml with D1, KV, and R2 configurations
- Added Prayer Wall database migration file

## [1.0.1] - Previous Release

### Features
- Multi-language Bible verse display (5 languages)
- 11 Bible versions support
- Beautiful glass morphism UI
- Global statistics with Durable Objects
- Automatic language detection
- Responsive design
- Background image rotation