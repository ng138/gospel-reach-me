import { useState, useEffect, useCallback } from 'react';
import { GlobalStats } from './components/GlobalStats';
import { BackgroundMedia } from './components/BackgroundMedia';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { VersionSelector } from './components/VersionSelector';
import { NameSubmissionForm } from './components/NameSubmissionForm';
import { BibleVerse } from './components/BibleVerse';
import { FloatingAudioPlayer } from './components/FloatingAudioPlayer';
import { Footer } from './components/Footer';
import { useAnonymousId } from './hooks/useAnonymousId';
import { 
  getRandomVerse, 
  getRandomBackground, 
  getCountryAndLanguage,
  trackVerseView,
  trackRefreshClick,
  trackLanguageSwitch 
} from './services/apiService';
import { VerseData, BackgroundData } from './types';

function App() {
  const anonymousId = useAnonymousId();
  const [currentLanguage, setCurrentLanguage] = useState<string>('EN');
  const [currentVersion, setCurrentVersion] = useState<string>('KJV');
  const [verse, setVerse] = useState<VerseData | null>(null);
  const [background, setBackground] = useState<BackgroundData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeoDetected, setIsGeoDetected] = useState(false);
  
  // Load random verse when language or version changes
  const loadRandomVerse = useCallback(async (isManualRefresh = false) => {
    setIsLoading(true);
    try {
      const verseData = await getRandomVerse(currentLanguage, currentVersion);
      setVerse(verseData);
      
      // Only track verse view for automatic loads (language/version changes, initial load)
      // Manual refresh clicks are tracked separately
      if (!isManualRefresh) {
        trackVerseView(currentLanguage, currentVersion);
      }
    } catch (error) {
      console.error('Failed to load verse:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage, currentVersion]);

  // Load random background
  const loadRandomBackground = useCallback(async () => {
    try {
      const backgroundData = await getRandomBackground();
      setBackground(backgroundData);
    } catch (error) {
      console.error('Failed to load background:', error);
    }
  }, []);

  // Load verse when language or version changes
  useEffect(() => {
    loadRandomVerse();
  }, [currentLanguage, currentVersion, loadRandomVerse]);

  // Load background on initial load
  useEffect(() => {
    loadRandomBackground();
  }, [loadRandomBackground]);

  // Geo-location detection for initial language setup
  useEffect(() => {
    const detectAndSetLanguage = async () => {
      if (isGeoDetected) return; // Only run once
      
      try {
        console.log('🌍 Detecting user location for language preference...');
        
        // Check URL parameters first (override geo-detection)
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang')?.toUpperCase();
        
        if (langParam && ['EN', 'FR', 'ES', 'DE', 'IT'].includes(langParam)) {
          console.log(`📍 Language set from URL parameter: ${langParam}`);
          handleLanguageChange(langParam);
          setIsGeoDetected(true);
          return;
        }
        
        // Get geo-detected language
        const { country, suggestedLanguage } = await getCountryAndLanguage();
        
        console.log(`🌍 Geo-detection: ${country} -> ${suggestedLanguage}`);
        
        // Only change language if it's different from current and supported
        if (suggestedLanguage !== currentLanguage && ['EN', 'FR', 'ES', 'DE', 'IT'].includes(suggestedLanguage)) {
          console.log(`🔄 Auto-switching to ${suggestedLanguage} based on location`);
          handleLanguageChange(suggestedLanguage);
        }
        
      } catch (error) {
        console.error('❌ Geo-detection failed:', error);
        // Continue with default language (EN)
      } finally {
        setIsGeoDetected(true);
      }
    };

    detectAndSetLanguage();
  }, [currentLanguage, isGeoDetected]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle language change
  const handleLanguageChange = (language: string) => {
    const previousLanguage = currentLanguage;
    setCurrentLanguage(language);
    
    // Track language switch
    if (previousLanguage !== language) {
      trackLanguageSwitch(previousLanguage, language);
    }
    
    // Set default version for selected language
    switch (language) {
      case 'EN': setCurrentVersion('KJV'); break;
      case 'FR': setCurrentVersion('LSG'); break;
      case 'IT': setCurrentVersion('CEI'); break;
      case 'ES': setCurrentVersion('RVR60'); break;
      case 'DE': setCurrentVersion('LUTH2017'); break;
    }
  };

  // Handle version change
  const handleVersionChange = (version: string) => {
    setCurrentVersion(version);
  };

  // Handle refresh button click
  const handleRefresh = () => {
    if (!isLoading) {
      console.log('Refreshing verse for language:', currentLanguage, 'version:', currentVersion);
      
      // Track refresh click (this handles the user interaction)
      trackRefreshClick();
      
      // Set loading state without clearing the current verse
      // This prevents the "Could not load verse" message from appearing
      setIsLoading(true);
      
      // Load a new verse (mark as manual refresh to avoid double counting)
      // and always refresh the background
      loadRandomVerse(true); // Pass true to indicate manual refresh
      loadRandomBackground();
    }
  };

  // 获取当前语言的TTS语言代码
  const getTTSLanguage = (lang: string) => {
    const languageMap: { [key: string]: string } = {
      'EN': 'en',
      'FR': 'fr', 
      'IT': 'it',
      'ES': 'es',
      'DE': 'de'
    };
    return languageMap[lang] || 'en';
  };

  // 获取当前版本的TTS版本代码
  const getTTSVersion = (version: string) => {
    return version.toLowerCase();
  };

  return (
    <>
      <BackgroundMedia background={background} />
      
      <div className="content-container">
        <header className="w-full max-w-3xl mx-auto py-4 px-2 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-center sm:text-left text-white drop-shadow-md">
            Gospel Reach Me
          </h1>
          <LanguageSwitcher 
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
          />
        </header>
        
        <main className="main-card">
          <div className="flex justify-center mb-6">
            <VersionSelector 
              currentLanguage={currentLanguage}
              currentVersion={currentVersion}
              onVersionChange={handleVersionChange}
            />
          </div>
          
          <BibleVerse 
            verse={verse} 
            isLoading={isLoading} 
            onRefresh={handleRefresh}
          />
          
          <GlobalStats />
          
          <NameSubmissionForm anonymousId={anonymousId} />
        </main>
        
        <Footer />
      </div>

      {/* 浮动音频播放器 */}
      {verse && (
        <FloatingAudioPlayer
          verseId={verse.index}
          language={getTTSLanguage(currentLanguage)}
          version={getTTSVersion(currentVersion)}
          isVisible={!isLoading && !!verse}
        />
      )}
    </>
  );
}

export default App;