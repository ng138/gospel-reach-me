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

// Track the last verse index for each language/version to avoid repeats
const lastVerseIndices: Record<string, number> = {};

// Get random verse based on language and version - PURE FRONTEND VERSION
export async function getRandomVerse(language: string, versionCode: string): Promise<VerseData> {
  // Add a small delay to simulate network request
  await new Promise(resolve => setTimeout(resolve, 200));
  
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

// Get random background - PURE FRONTEND VERSION
export async function getRandomBackground(): Promise<BackgroundData> {
  // Add a small delay to simulate network request
  await new Promise(resolve => setTimeout(resolve, 200));
  
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

// Get simulated global stats - FRONTEND ONLY VERSION
export async function getGlobalStats() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Generate dynamic stats that change over time for realism
  const baseTime = Date.now();
  const dailyVariation = Math.floor(baseTime / (1000 * 60 * 60 * 24)) % 100;
  
  return {
    total: 15000 + dailyVariation * 10,
    countries: {
      US: 1500 + (dailyVariation % 10), 
      GB: 750 + (dailyVariation % 8), 
      CA: 450 + (dailyVariation % 6), 
      DE: 650 + (dailyVariation % 7), 
      FR: 675 + (dailyVariation % 9),
      ES: 850 + (dailyVariation % 12), 
      IT: 725 + (dailyVariation % 8), 
      BR: 925 + (dailyVariation % 15), 
      MX: 475 + (dailyVariation % 7), 
      IN: 1100 + (dailyVariation % 20),
      AU: 300 + (dailyVariation % 5), 
      JP: 350 + (dailyVariation % 6), 
      RU: 425 + (dailyVariation % 8), 
      NG: 250 + (dailyVariation % 4), 
      ZA: 200 + (dailyVariation % 3)
    }
  };
}

// Submit name - FRONTEND SIMULATION
export async function submitName(data: NameSubmission): Promise<{ success: boolean }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!data.user_name || !data.user_id) {
    throw new Error('Missing required fields');
  }
  
  // 95% success rate for demo purposes
  if (Math.random() < 0.05) {
    throw new Error('Submission failed. Please try again.');
  }
  
  console.log('Name submitted (frontend simulation):', data.user_name);
  
  return { success: true };
}

// Get user's country and suggested language - FRONTEND SIMULATION
export async function getCountryAndLanguage(): Promise<{ country: string; suggestedLanguage: string }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Simulate different countries for variety
  const countries = ['FR', 'DE', 'ES', 'IT', 'US', 'CA', 'GB', 'AU', 'BR', 'MX'];
  const randomCountry = countries[Math.floor(Math.random() * countries.length)];
  
  const countryToLanguage: Record<string, string> = {
    'FR': 'FR', 'BE': 'FR', 'CH': 'FR', 'MC': 'FR',
    'DE': 'DE', 'AT': 'DE', 'LI': 'DE',
    'ES': 'ES', 'MX': 'ES', 'AR': 'ES', 'CO': 'ES', 'PE': 'ES', 'CL': 'ES',
    'IT': 'IT', 'SM': 'IT', 'VA': 'IT',
    'US': 'EN', 'GB': 'EN', 'CA': 'EN', 'AU': 'EN', 'NZ': 'EN', 'IE': 'EN',
    'BR': 'ES', // Simplified - could be Portuguese
  };
  
  const suggestedLanguage = countryToLanguage[randomCountry] || 'EN';
  
  console.log(`[FRONTEND] Simulated geo-detection: ${randomCountry} -> ${suggestedLanguage}`);
  
  return { country: randomCountry, suggestedLanguage };
}