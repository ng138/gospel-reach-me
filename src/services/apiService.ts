import { VerseData, BackgroundData, NameSubmission } from '../types';

// Import Bible verse files from frontend data directory
import bibleVersesENKJV from '../data/bible_verses/bible_verses_en_kjv.json';
import bibleVersesENNIV from '../data/bible_verses/bible_verses_en_niv.json';
import bibleVersesENESV from '../data/bible_verses/bible_verses_en_esv.json';
import bibleVersesFRLSG from '../data/bible_verses/bible_verses_fr_lsg.json';
import bibleVersesFRBDS from '../data/bible_verses/bible_verses_fr_bds.json';
import bibleVersesITCEI from '../data/bible_verses/bible_verses_it_cei.json';
import bibleVersesITNR94 from '../data/bible_verses/bible_verses_it_nr94.json';
import bibleVersesESRVR60 from '../data/bible_verses/bible_verses_es_rvr60.json';
import bibleVersesESNVI from '../data/bible_verses/bible_verses_es_nvi.json';
import bibleVersesDELUTH2017 from '../data/bible_verses/bible_verses_de_luth2017.json';
import bibleVersesDEELB from '../data/bible_verses/bible_verses_de_elb.json';

// Import background media index from frontend data directory
import backgroundMediaIndex from '../data/background_media_index.json';

// Map language/version codes to verse files
const verseFilesMap: Record<string, any> = {
  // English versions
  'EN_KJV': bibleVersesENKJV,
  'EN_NIV': bibleVersesENNIV,
  'EN_ESV': bibleVersesENESV,
  // French versions
  'FR_LSG': bibleVersesFRLSG,
  'FR_BDS': bibleVersesFRBDS,
  // Italian versions
  'IT_CEI': bibleVersesITCEI,
  'IT_NR94': bibleVersesITNR94,
  // Spanish versions
  'ES_RVR60': bibleVersesESRVR60,
  'ES_NVI': bibleVersesESNVI,
  // German versions
  'DE_LUTH2017': bibleVersesDELUTH2017,
  'DE_ELB': bibleVersesDEELB
};

// Cloudflare Worker API URL - will be set via environment variables
const WORKER_API_URL = import.meta.env.VITE_WORKER_URL || 'https://gospel-reach-me-worker.ng138.workers.dev';

// Track the last verse index for each language/version to avoid repeats
const lastVerseIndices: Record<string, number> = {};

// Get random verse based on language and version
export async function getRandomVerse(language: string, versionCode: string): Promise<VerseData> {
  // In production, try to use the worker API first
  if (import.meta.env.PROD) {
    try {
      const response = await fetch(`${WORKER_API_URL}/api/verse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: language.toUpperCase(),
          version: versionCode
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          text: data.verse_content,
          reference: data.reference,
          index: data.index
        };
      }
    } catch (error) {
      console.warn('Worker API unavailable, falling back to local data:', error);
    }
  }

  // Fallback to local data (for development or when worker is unavailable)
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const key = `${language.toUpperCase()}_${versionCode}`;
  console.log('Loading verses for key:', key);
  
  if (!verseFilesMap[key]) {
    console.warn(`No verses found for ${key}, falling back to EN_KJV`);
  }
  
  const verses = verseFilesMap[key] || bibleVersesENKJV;
  
  let randomIndex = Math.floor(Math.random() * verses.length);
  const lastIndex = lastVerseIndices[key];
  
  if (lastIndex !== undefined) {
    for (let i = 0; i < 10; i++) {
      const newIndex = Math.floor(Math.random() * verses.length);
      if (newIndex !== lastIndex) {
        randomIndex = newIndex;
        break;
      }
    }
  }
  
  lastVerseIndices[key] = randomIndex;
  const randomVerse = verses[randomIndex];
  
  return {
    text: randomVerse.verse_content,
    reference: randomVerse.reference,
    index: `${randomVerse.index}-${Date.now().toString().slice(-6)}`
  };
}

// Track the last background to avoid repeats
let lastBackgroundIndex: number | undefined;

// Get random background
export async function getRandomBackground(): Promise<BackgroundData> {
  // In production, try to use the worker API first
  if (import.meta.env.PROD) {
    try {
      const response = await fetch(`${WORKER_API_URL}/api/background`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          type: 'image',
          url: data.url
        };
      }
    } catch (error) {
      console.warn('Worker API unavailable for background, falling back to local data:', error);
    }
  }

  // Fallback to local data
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let randomIndex = Math.floor(Math.random() * backgroundMediaIndex.length);
  
  if (lastBackgroundIndex !== undefined) {
    for (let i = 0; i < 5; i++) {
      const newIndex = Math.floor(Math.random() * backgroundMediaIndex.length);
      if (newIndex !== lastBackgroundIndex) {
        randomIndex = newIndex;
        break;
      }
    }
  }
  
  lastBackgroundIndex = randomIndex;
  const background = backgroundMediaIndex[randomIndex];
  
  return {
    type: 'image',
    url: background.url
  };
}

// Get global stats from the Cloudflare Worker's global counter
export async function getGlobalStats() {
  try {
    const apiUrl = import.meta.env.PROD
      ? `${WORKER_API_URL}/api/stats`
      : '/api/stats';
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching global stats:', error);
    
    // Fallback data
    return {
      total: 12500,
      countries: {
        US: 1250, GB: 650, CA: 400, DE: 500, FR: 575,
        ES: 750, IT: 675, BR: 875, MX: 425, IN: 1000,
        AU: 250, JP: 300, RU: 375, NG: 200, ZA: 175
      }
    };
  }
}

// Submit name
export async function submitName(data: NameSubmission): Promise<{ success: boolean }> {
  try {
    if (import.meta.env.PROD) {
      const response = await fetch(`${WORKER_API_URL}/api/submit-name`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        return await response.json();
      }
    }
  } catch (error) {
    console.warn('Worker API unavailable for name submission, using fallback:', error);
  }

  // Fallback implementation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (!data.user_name || !data.user_id) {
    throw new Error('Missing required fields');
  }
  
  if (Math.random() < 0.1) {
    throw new Error('Submission failed. Please try again.');
  }
  
  return { success: true };
}

// Get user's country and suggested language based on geo-location
export async function getCountryAndLanguage(): Promise<{ country: string; suggestedLanguage: string }> {
  try {
    // In development mode, simulate different countries
    if (!import.meta.env.PROD) {
      const testCountries = ['FR', 'DE', 'ES', 'IT', 'US', 'CA', 'GB'];
      const randomCountry = testCountries[Math.floor(Math.random() * testCountries.length)];
      
      const countryToLanguage: Record<string, string> = {
        'FR': 'FR', 'BE': 'FR', 'CH': 'FR', 'MC': 'FR',
        'DE': 'DE', 'AT': 'DE', 'LI': 'DE',
        'ES': 'ES', 'MX': 'ES', 'AR': 'ES', 'CO': 'ES', 'PE': 'ES', 'CL': 'ES',
        'IT': 'IT', 'SM': 'IT', 'VA': 'IT',
        'US': 'EN', 'GB': 'EN', 'CA': 'EN', 'AU': 'EN', 'NZ': 'EN', 'IE': 'EN',
      };
      
      const suggestedLanguage = countryToLanguage[randomCountry] || 'EN';
      
      console.log(`[DEV] Simulated geo-detection: ${randomCountry} -> ${suggestedLanguage}`);
      
      return { country: randomCountry, suggestedLanguage };
    }
    
    // In production, call the worker API
    const response = await fetch(`${WORKER_API_URL}/api/geo-detect`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`Geo-detection failed: ${response.status}`);
    }
    
    const result = await response.json();
    
    return {
      country: result.country || 'US',
      suggestedLanguage: result.suggestedLanguage || 'EN'
    };
    
  } catch (error) {
    console.error('Error detecting country/language:', error);
    
    return { country: 'US', suggestedLanguage: 'EN' };
  }
}