import { VerseData, BackgroundData, NameSubmission } from '../types';

// Import Bible verse files
import bibleVersesENKJV from '../../worker/src/data/bible_verses/bible_verses_en_kjv.json';
import bibleVersesENNIV from '../../worker/src/data/bible_verses/bible_verses_en_niv.json';
import bibleVersesENESV from '../../worker/src/data/bible_verses/bible_verses_en_esv.json';
import bibleVersesFRLSG from '../../worker/src/data/bible_verses/bible_verses_fr_lsg.json';
import bibleVersesFRBDS from '../../worker/src/data/bible_verses/bible_verses_fr_bds.json';
import bibleVersesITCEI from '../../worker/src/data/bible_verses/bible_verses_it_cei.json';
import bibleVersesITNR94 from '../../worker/src/data/bible_verses/bible_verses_it_nr94.json';
import bibleVersesESRVR60 from '../../worker/src/data/bible_verses/bible_verses_es_rvr60.json';
import bibleVersesESNVI from '../../worker/src/data/bible_verses/bible_verses_es_nvi.json';
import bibleVersesDELUTH2017 from '../../worker/src/data/bible_verses/bible_verses_de_luth2017.json';
import bibleVersesDEELB from '../../worker/src/data/bible_verses/bible_verses_de_elb.json';

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

// API URL will be used when connecting to the actual Cloudflare Worker
// const API_BASE_URL = 'http://localhost:5173/api';

// Track the last verse index for each language/version to avoid repeats
const lastVerseIndices: Record<string, number> = {};

// Get random verse based on language and version
export async function getRandomVerse(language: string, versionCode: string): Promise<VerseData> {
  // Add a small delay to simulate network request
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Ensure language is uppercase and construct the key properly
  const key = `${language.toUpperCase()}_${versionCode}`;
  
  console.log('Loading verses for key:', key);
  
  // Check if we have verses for this language/version combination
  if (!verseFilesMap[key]) {
    console.warn(`No verses found for ${key}, falling back to EN_KJV`);
  }
  
  const verses = verseFilesMap[key] || bibleVersesENKJV; // Fallback to KJV if not found
  
  // Get a random verse that's different from the last one
  let randomIndex = Math.floor(Math.random() * verses.length);
  const lastIndex = lastVerseIndices[key];
  
  // Try up to 10 times to get a different verse
  if (lastIndex !== undefined) {
    for (let i = 0; i < 10; i++) {
      const newIndex = Math.floor(Math.random() * verses.length);
      // If we have a different index, use it and break
      if (newIndex !== lastIndex) {
        randomIndex = newIndex;
        break;
      }
    }
  }
  
  // Store this index as the last one used for this language/version
  lastVerseIndices[key] = randomIndex;
  
  const randomVerse = verses[randomIndex];
  
  // Add a timestamp to make each verse appear unique even if content is the same
  return {
    text: randomVerse.verse_content,
    reference: randomVerse.reference,
    index: `${randomVerse.index}-${Date.now().toString().slice(-6)}` // Add timestamp suffix
  };
}

// Import background media index
import backgroundMediaIndex from '../../worker/src/data/background_media_index.json';

// Track the last background to avoid repeats
let lastBackgroundIndex: number | undefined;

// Get random background
export async function getRandomBackground(): Promise<BackgroundData> {
  // Add a small delay to simulate network request
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get a random background that's different from the last one
  let randomIndex = Math.floor(Math.random() * backgroundMediaIndex.length);
  
  // Try up to 5 times to get a different background
  if (lastBackgroundIndex !== undefined) {
    for (let i = 0; i < 5; i++) {
      const newIndex = Math.floor(Math.random() * backgroundMediaIndex.length);
      if (newIndex !== lastBackgroundIndex) {
        randomIndex = newIndex;
        break;
      }
    }
  }
  
  // Store this index as the last one used
  lastBackgroundIndex = randomIndex;
  
  // Get the background from the index
  const background = backgroundMediaIndex[randomIndex];
  
  // All URLs are now real and working - no need for placeholder replacement
  
  // Return image background
  return {
    type: 'image',
    url: background.url
  };
}

// API URL for the Cloudflare Worker
const WORKER_API_URL = 'https://gospel-reach-me-worker.your-subdomain.workers.dev';

// Get global stats from the Cloudflare Worker's global counter
export async function getGlobalStats() {
  try {
    // In development mode, we'll use a local endpoint
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
    
    // Fallback data in case the API call fails
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
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate validation
  if (!data.user_name || !data.user_id) {
    throw new Error('Missing required fields');
  }
  
  // 10% chance of failure for testing error handling
  if (Math.random() < 0.1) {
    throw new Error('Submission failed. Please try again.');
  }
  
  return { success: true };
}

// Get user's country and suggested language based on geo-location
export async function getCountryAndLanguage(): Promise<{ country: string; suggestedLanguage: string }> {
  try {
    // In development mode, we'll use a fallback
    if (!import.meta.env.PROD) {
      // For development, we can simulate different countries for testing
      const testCountries = ['FR', 'DE', 'ES', 'IT', 'US', 'CA', 'GB'];
      const randomCountry = testCountries[Math.floor(Math.random() * testCountries.length)];
      
      // Map countries to languages
      const countryToLanguage: Record<string, string> = {
        'FR': 'FR',  // France -> French
        'BE': 'FR',  // Belgium -> French (though it could also be Dutch/German)
        'CH': 'FR',  // Switzerland -> French (though it could also be German/Italian)
        'MC': 'FR',  // Monaco -> French
        'DE': 'DE',  // Germany -> German
        'AT': 'DE',  // Austria -> German
        'LI': 'DE',  // Liechtenstein -> German
        'ES': 'ES',  // Spain -> Spanish
        'MX': 'ES',  // Mexico -> Spanish
        'AR': 'ES',  // Argentina -> Spanish
        'CO': 'ES',  // Colombia -> Spanish
        'PE': 'ES',  // Peru -> Spanish
        'CL': 'ES',  // Chile -> Spanish
        'IT': 'IT',  // Italy -> Italian
        'SM': 'IT',  // San Marino -> Italian
        'VA': 'IT',  // Vatican City -> Italian
        'US': 'EN',  // United States -> English
        'GB': 'EN',  // United Kingdom -> English
        'CA': 'EN',  // Canada -> English (though could also be French)
        'AU': 'EN',  // Australia -> English
        'NZ': 'EN',  // New Zealand -> English
        'IE': 'EN',  // Ireland -> English
      };
      
      const suggestedLanguage = countryToLanguage[randomCountry] || 'EN';
      
      console.log(`[DEV] Simulated geo-detection: ${randomCountry} -> ${suggestedLanguage}`);
      
      return {
        country: randomCountry,
        suggestedLanguage
      };
    }
    
    // In production, call the worker API to get country from CF-IPCountry header
    const apiUrl = `${WORKER_API_URL}/api/geo-detect`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
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
    
    // Fallback to English and US
    return {
      country: 'US',
      suggestedLanguage: 'EN'
    };
  }
}