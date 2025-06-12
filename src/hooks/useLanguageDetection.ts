import { useState, useEffect } from 'react';
import { getCountryAndLanguage } from '../services/apiService';
import { Language } from '../types';

// Helper functions for language configuration
function getLanguageName(code: string): string {
  const names: Record<string, string> = {
    'EN': 'English',
    'FR': 'French',
    'ES': 'Spanish',
    'DE': 'German',
    'IT': 'Italian'
  };
  return names[code] || 'English';
}

function getLanguageVersions(code: string): string[] {
  const versions: Record<string, string[]> = {
    'EN': ['KJV', 'NIV', 'ESV'],
    'FR': ['LSG', 'BDS'],
    'ES': ['RVR60', 'NVI'],
    'DE': ['LUTH2017', 'ELB'],
    'IT': ['CEI', 'NR94']
  };
  return versions[code] || ['KJV'];
}

export function useLanguageDetection(): Language | null {
  const [detectedLanguage, setDetectedLanguage] = useState<Language | null>(null);
  
  useEffect(() => {
    const detectLanguage = async () => {
      try {
        let langCode = 'EN';
        
        // 1. Check URL parameters first (highest priority)
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang')?.toUpperCase();
        
        if (langParam && ['EN', 'FR', 'ES', 'DE', 'IT'].includes(langParam)) {
          langCode = langParam;
          console.log(`🔗 Language from URL: ${langCode}`);
        } else {
          // 2. Use geo-location detection (medium priority)
          try {
            const { country, suggestedLanguage } = await getCountryAndLanguage();
            langCode = suggestedLanguage;
            console.log(`🌍 Language from geo-detection: ${country} -> ${langCode}`);
          } catch (geoError) {
            console.warn('Geo-detection failed, using browser language detection');
            
            // 3. Fallback to browser language (lowest priority)
            const browserLang = navigator.language?.split('-')[0]?.toUpperCase();
            if (browserLang && ['EN', 'FR', 'ES', 'DE', 'IT'].includes(browserLang)) {
              langCode = browserLang;
              console.log(`🌐 Language from browser: ${langCode}`);
            }
          }
        }
        
        // Return the detected language code as a simple Language object
        const languageConfig: Language = {
          code: langCode,
          name: getLanguageName(langCode),
          versions: getLanguageVersions(langCode)
        };
        
        setDetectedLanguage(languageConfig);
        
      } catch (error) {
        console.error('Failed to detect language:', error);
        // Fallback to English
        const fallbackLanguage: Language = {
          code: 'EN',
          name: 'English',
          versions: ['KJV', 'NIV', 'ESV']
        };
        setDetectedLanguage(fallbackLanguage);
      }
    };
    
    detectLanguage();
  }, []);
  
  return detectedLanguage;
}