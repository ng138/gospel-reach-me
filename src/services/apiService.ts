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

// Real-time stats tracking with event system
interface StatsData {
  verseViews: number;
  refreshClicks: number;
  languageSwitches: Record<string, number>;
  versionSwitches: Record<string, number>;
  nameSubmissions: number;
  lastUpdated: number;
  sessionId: string;
}

// Event system for real-time updates
type StatsEventListener = (stats: StatsData) => void;
const statsEventListeners: StatsEventListener[] = [];

// Subscribe to stats updates
export function subscribeToStatsUpdates(listener: StatsEventListener): () => void {
  statsEventListeners.push(listener);
  
  // Return unsubscribe function
  return () => {
    const index = statsEventListeners.indexOf(listener);
    if (index > -1) {
      statsEventListeners.splice(index, 1);
    }
  };
}

// Notify all listeners of stats changes
function notifyStatsListeners(): void {
  const currentStats = { ...localStats };
  statsEventListeners.forEach(listener => {
    try {
      listener(currentStats);
    } catch (error) {
      console.warn('Stats listener error:', error);
    }
  });
}

// Initialize stats tracking
let localStats: StatsData = {
  verseViews: 0,
  refreshClicks: 0,
  languageSwitches: {},
  versionSwitches: {},
  nameSubmissions: 0,
  lastUpdated: Date.now(),
  sessionId: generateSessionId()
};

// Load existing stats from localStorage
function loadLocalStats(): void {
  try {
    const stored = localStorage.getItem('gospel-reach-stats');
    if (stored) {
      const parsed = JSON.parse(stored);
      localStats = { ...localStats, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load local stats:', error);
  }
}

// Save stats to localStorage and notify listeners
function saveLocalStats(): void {
  try {
    localStats.lastUpdated = Date.now();
    localStorage.setItem('gospel-reach-stats', JSON.stringify(localStats));
    
    // Immediately notify all listeners for real-time updates
    notifyStatsListeners();
  } catch (error) {
    console.warn('Failed to save local stats:', error);
  }
}

// Generate session ID
function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Initialize stats on module load
loadLocalStats();

// Track verse view with immediate UI update
export function trackVerseView(language: string, version: string): void {
  localStats.verseViews++;
  const key = `${language}_${version}`;
  localStats.versionSwitches[key] = (localStats.versionSwitches[key] || 0) + 1;
  saveLocalStats(); // This will trigger immediate UI update
  
  // Optional: Send to analytics service
  sendToAnalytics('verse_view', {
    language,
    version,
    timestamp: Date.now()
  });
}

// Track refresh click with immediate UI update
export function trackRefreshClick(): void {
  localStats.refreshClicks++;
  saveLocalStats(); // This will trigger immediate UI update
  
  sendToAnalytics('refresh_click', {
    timestamp: Date.now()
  });
}

// Track language switch with immediate UI update
export function trackLanguageSwitch(fromLang: string, toLang: string): void {
  localStats.languageSwitches[toLang] = (localStats.languageSwitches[toLang] || 0) + 1;
  saveLocalStats(); // This will trigger immediate UI update
  
  sendToAnalytics('language_switch', {
    from: fromLang,
    to: toLang,
    timestamp: Date.now()
  });
}

// Track name submission with immediate UI update
export function trackNameSubmission(): void {
  localStats.nameSubmissions++;
  saveLocalStats(); // This will trigger immediate UI update
  
  sendToAnalytics('name_submission', {
    timestamp: Date.now()
  });
}

// Send analytics data to external service (configurable)
async function sendToAnalytics(event: string, data: any): Promise<void> {
  // Option 1: Google Analytics 4
  if (typeof (window as any).gtag !== 'undefined') {
    (window as any).gtag('event', event, data);
  }
  
  // Option 2: Simple HTTP endpoint (you can replace with your preferred service)
  try {
    const analyticsEndpoint = 'https://api.countapi.xyz/hit/gospel-reach-me.pages.dev/' + event;
    await fetch(analyticsEndpoint, { method: 'GET' });
  } catch (error) {
    console.warn('Analytics request failed:', error);
  }
}

// Get real local stats
export function getLocalStats(): StatsData {
  return { ...localStats };
}

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

// Get random background by calling the Cloudflare Pages function
export async function getRandomBackground(): Promise<BackgroundData> {
  try {
    const response = await fetch('/api/random-background');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = (await response.json()) as BackgroundData;
    return data;
  } catch (error) {
    console.error('Failed to fetch random background:', error);
    // Fallback to a default image
    const fallbackImages = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    ];
    const randomFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    return {
      type: 'image',
      url: randomFallback
    };
  }
}

// Get combined real + simulated global stats
export async function getGlobalStats() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get real stats from multiple sources
  const realStats = await fetchRealGlobalStats();
  
  return realStats;
}

// Fetch real global stats from analytics service
async function fetchRealGlobalStats() {
  try {
    // Option 1: Use CountAPI.xyz (free, simple)
    const endpoints = [
      'https://api.countapi.xyz/get/gospel-reach-me.pages.dev/verse_view',
      'https://api.countapi.xyz/get/gospel-reach-me.pages.dev/refresh_click',
      'https://api.countapi.xyz/get/gospel-reach-me.pages.dev/language_switch',
      'https://api.countapi.xyz/get/gospel-reach-me.pages.dev/name_submission'
    ];
    
    const responses = await Promise.allSettled(
      endpoints.map(url => fetch(url).then(r => r.json()))
    );
    
    let totalViews = 0;
    responses.forEach(response => {
      if (response.status === 'fulfilled' && response.value?.value) {
        totalViews += response.value.value;
      }
    });
    
    // If we have real data, use it; otherwise fall back to simulation
    if (totalViews > 0) {
      return {
        total: totalViews,
        countries: await generateCountryDistribution(totalViews),
        isReal: true
      };
    }
  } catch (error) {
    console.warn('Failed to fetch real stats:', error);
  }
  
  // Enhanced simulation that includes local user contributions for real-time feel
  const baseTime = Date.now();
  const dailyVariation = Math.floor(baseTime / (1000 * 60 * 60 * 24)) % 100;
  const hourlyVariation = Math.floor(baseTime / (1000 * 60 * 60)) % 10;
  
  // Include local user's contributions to make it feel more real-time
  const localViewsContribution = localStats.verseViews;
  const localRefreshContribution = localStats.refreshClicks;
  const localNameContribution = localStats.nameSubmissions;
  const totalLocalContribution = localViewsContribution + localRefreshContribution + localNameContribution;
  
  // Base number that changes throughout the day
  const baseTotal = 15000 + dailyVariation * 10 + hourlyVariation * 2;
  
  return {
    total: baseTotal + totalLocalContribution,
    countries: {
      US: 1500 + (dailyVariation % 10) + Math.floor(totalLocalContribution * 0.25), 
      GB: 750 + (dailyVariation % 8) + Math.floor(totalLocalContribution * 0.12), 
      CA: 450 + (dailyVariation % 6) + Math.floor(totalLocalContribution * 0.08), 
      DE: 650 + (dailyVariation % 7) + Math.floor(totalLocalContribution * 0.10), 
      FR: 675 + (dailyVariation % 9) + Math.floor(totalLocalContribution * 0.09),
      ES: 850 + (dailyVariation % 12) + Math.floor(totalLocalContribution * 0.11), 
      IT: 725 + (dailyVariation % 8) + Math.floor(totalLocalContribution * 0.07), 
      BR: 925 + (dailyVariation % 15) + Math.floor(totalLocalContribution * 0.08), 
      MX: 475 + (dailyVariation % 7) + Math.floor(totalLocalContribution * 0.05), 
      IN: 1100 + (dailyVariation % 20) + Math.floor(totalLocalContribution * 0.05),
      AU: 300 + (dailyVariation % 5), 
      JP: 350 + (dailyVariation % 6), 
      RU: 425 + (dailyVariation % 8), 
      NG: 250 + (dailyVariation % 4), 
      ZA: 200 + (dailyVariation % 3)
    },
    isReal: false
  };
}

// Generate country distribution based on total views
async function generateCountryDistribution(totalViews: number): Promise<Record<string, number>> {
  // Distribute views across countries based on typical web traffic patterns
  const distribution = {
    US: 0.25,    // 25%
    GB: 0.12,    // 12% 
    CA: 0.08,    // 8%
    DE: 0.10,    // 10%
    FR: 0.09,    // 9%
    ES: 0.11,    // 11%
    IT: 0.07,    // 7%
    BR: 0.08,    // 8%
    IN: 0.05,    // 5%
    AU: 0.05     // 5%
  };
  
  const countries: Record<string, number> = {};
  Object.entries(distribution).forEach(([country, percentage]) => {
    countries[country] = Math.floor(totalViews * percentage);
  });
  
  return countries;
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