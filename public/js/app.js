// Global variables
let currentLang = 'EN';
let currentVersion = '';
let userId = '';
let map = null;
let statsInterval = null;

// DOM Elements
const langSwitcher = document.getElementById('lang-switcher');
const versionSelect = document.getElementById('version-select');
const verseContainer = document.getElementById('verse-container');
const refreshBtn = document.getElementById('refresh-btn');
const nameForm = document.getElementById('name-form');
const statsContainer = document.getElementById('stats-container');
const mapContainer = document.getElementById('map-container');
const topCountriesContainer = document.getElementById('top-countries');
const backgroundContainer = document.getElementById('background-container');
const cookieBanner = document.getElementById('cookie-banner');
const acceptCookiesBtn = document.getElementById('accept-cookies');
const rejectCookiesBtn = document.getElementById('reject-cookies');
const verseViewBtn = document.getElementById('verse-view-btn');
const mapViewBtn = document.getElementById('map-view-btn');
const verseView = document.getElementById('verse-view');
const mapView = document.getElementById('map-view');
const testFallbackBtn = document.getElementById('test-fallback-btn');

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
  // Check for cookie consent
  checkCookieConsent();
  
  // Initialize user ID
  initUserId();
  
  // Set up event listeners
  setupEventListeners();
  
  // Load initial verse and background
  await loadInitialContent();
  
  // Start stats polling
  startStatsPolling();
});

// Check if user has consented to cookies
function checkCookieConsent() {
  const hasConsent = localStorage.getItem('cookie_consent');
  
  if (!hasConsent) {
    cookieBanner.classList.remove('hidden');
  }
}

// Initialize anonymous user ID
function initUserId() {
  // Only initialize if user has consented
  if (localStorage.getItem('cookie_consent') === 'accepted') {
    userId = localStorage.getItem('gospel_user_id');
    
    if (!userId) {
      userId = generateUUID();
      localStorage.setItem('gospel_user_id', userId);
    }
  }
}

// Generate a UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Set up event listeners
function setupEventListeners() {
  // Language switcher
  langSwitcher.addEventListener('click', async (e) => {
    if (e.target.tagName === 'BUTTON') {
      const newLang = e.target.dataset.lang;
      await switchLanguage(newLang);
    }
  });
  
  // Refresh button
  refreshBtn.addEventListener('click', async () => {
    console.log('Refresh button clicked');
    await refreshVerse();
    await refreshBackground();
    // Add debug information after refresh
    setTimeout(() => {
      logBackgroundStatus();
    }, 1000);
  });
  
  // Name form submission
  nameForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await submitName();
  });
  
  // Cookie consent buttons
  acceptCookiesBtn.addEventListener('click', () => {
    localStorage.setItem('cookie_consent', 'accepted');
    cookieBanner.classList.add('hidden');
    initUserId(); // Initialize user ID after consent
  });
  
  rejectCookiesBtn.addEventListener('click', () => {
    localStorage.setItem('cookie_consent', 'rejected');
    cookieBanner.classList.add('hidden');
  });
  
  // View toggle buttons
  verseViewBtn.addEventListener('click', () => {
    switchToVerseView();
  });
  
  mapViewBtn.addEventListener('click', () => {
    switchToMapView();
  });
  
  // Test fallback background button
  testFallbackBtn.addEventListener('click', () => {
    console.log('Testing fallback background');
    setFallbackBackground();
    setTimeout(() => {
      logBackgroundStatus();
    }, 500);
  });
}

// Load initial content
async function loadInitialContent() {
  try {
    // 立即设置一个备用背景，防止白屏
    setFallbackBackground();
    
    // Get language config
    await switchLanguage(currentLang);
    
    // Load initial background (this will replace the fallback if successful)
    await refreshBackground();
  } catch (error) {
    console.error('Error loading initial content:', error);
    verseContainer.textContent = 'Error loading content. Please try again.';
    // 确保即使出错也有背景
    setFallbackBackground();
  }
}

// Switch language
async function switchLanguage(lang) {
  try {
    // Update active button
    const buttons = langSwitcher.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Update current language
    currentLang = lang;
    
    // Fetch language config
    const response = await fetch(`/api/config?lang=${lang}`);
    const config = await response.json();
    
    // Update version select
    updateVersionSelect(config);
    
    // Set current version to default for this language
    currentVersion = config.defaultVersion;
    
    // Fetch verse for this language and version
    await refreshVerse();
    
    // Update URL
    updateURL();
  } catch (error) {
    console.error('Error switching language:', error);
  }
}

// Update version select dropdown
function updateVersionSelect(config) {
  // Clear previous versions
  versionSelect.innerHTML = '';
  
  // Create buttons for each version
  Object.entries(config.versions).forEach(([code, name]) => {
    const button = document.createElement('button');
    button.dataset.version = code;
    button.textContent = name;
    button.classList.toggle('active', code === config.defaultVersion);
    
    button.addEventListener('click', async () => {
      // Update active button
      versionSelect.querySelectorAll('button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.version === code);
      });
      
      // Update current version
      currentVersion = code;
      
      // Fetch verse for this version
      await refreshVerse();
      
      // Update URL
      updateURL();
    });
    
    versionSelect.appendChild(button);
  });
}

// Refresh verse
async function refreshVerse() {
  try {
    verseContainer.innerHTML = '<div class="loading">Loading...</div>';
    
    const response = await fetch(`/api/verse?lang=${currentLang}&version=${currentVersion}`);
    const data = await response.json();
    
    // Parse the verse data
    let verseData;
    try {
      // Try to parse the verse as JSON (for new format)
      verseData = JSON.parse(data.verse);
    } catch (e) {
      // If parsing fails, use the old format (plain text)
      verseData = { text: data.verse, reference: '' };
    }
    
    // Create HTML for verse display
    const verseHTML = `
      <div class="verse-text">${verseData.text}</div>
      <div class="verse-reference">${verseData.reference}</div>
    `;
    
    verseContainer.innerHTML = verseHTML;
  } catch (error) {
    console.error('Error refreshing verse:', error);
    verseContainer.innerHTML = '<div class="error">Error loading verse. Please try again.</div>';
  }
}

// Refresh background
async function refreshBackground() {
  try {
    // 设置初始备用背景，防止出现空白
    if (!backgroundContainer.style.background && backgroundContainer.children.length === 0) {
      setFallbackBackground();
    }
    
    const response = await fetch('/api/random-background');
    const data = await response.json();
    
    console.log('Background API response:', data);
    
    // Create new element based on type
    if (data.type === 'image') {
      await handleImageBackground(data.url);
    } else if (data.type === 'video') {
      await handleVideoBackground(data.url);
    } else if (data.type === 'gradient') {
      handleGradientBackground(data.background);
    } else {
      console.warn('Unknown background type:', data.type);
      setFallbackBackground();
    }
  } catch (error) {
    console.error('Error refreshing background:', error);
    setFallbackBackground();
  }
}

// Handle image background with enhanced error handling
async function handleImageBackground(imageUrl) {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.alt = 'Background';
    
    let isResolved = false;
    const resolveOnce = (success) => {
      if (!isResolved) {
        isResolved = true;
        resolve(success);
      }
    };
    
    // Set a shorter timeout (3 seconds instead of 5)
    const timeoutId = setTimeout(() => {
      console.log('Image loading timeout, using fallback');
      setFallbackBackground();
      resolveOnce(false);
    }, 3000);
    
    img.onload = () => {
      clearTimeout(timeoutId);
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        console.log('Background image loaded successfully');
        // Clear previous background
        backgroundContainer.innerHTML = '';
        backgroundContainer.style.background = '';
        backgroundContainer.appendChild(img);
        resolveOnce(true);
      } else {
        console.log('Image loaded but has no dimensions, using fallback');
        setFallbackBackground();
        resolveOnce(false);
      }
    };
    
    img.onerror = () => {
      clearTimeout(timeoutId);
      console.log('External image failed to load, using fallback');
      setFallbackBackground();
      resolveOnce(false);
    };
    
    // Start loading the image
    img.src = imageUrl;
  });
}

// Handle video background with enhanced error handling
async function handleVideoBackground(videoUrl) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    
    let isResolved = false;
    const resolveOnce = (success) => {
      if (!isResolved) {
        isResolved = true;
        resolve(success);
      }
    };
    
    const timeoutId = setTimeout(() => {
      console.log('Video loading timeout, using fallback');
      setFallbackBackground();
      resolveOnce(false);
    }, 5000);
    
    video.onloadeddata = () => {
      clearTimeout(timeoutId);
      console.log('Background video loaded successfully');
      // Clear previous background
      backgroundContainer.innerHTML = '';
      backgroundContainer.style.background = '';
      backgroundContainer.appendChild(video);
      resolveOnce(true);
    };
    
    video.onerror = () => {
      clearTimeout(timeoutId);
      console.log('Video failed to load, using fallback');
      setFallbackBackground();
      resolveOnce(false);
    };
    
    video.src = videoUrl;
  });
}

// Handle gradient background
function handleGradientBackground(gradientBackground) {
  console.log('Applying gradient background:', gradientBackground);
  
  // Clear previous background
  backgroundContainer.innerHTML = '';
  backgroundContainer.style.background = gradientBackground;
  
  // Add a subtle pattern overlay for visual interest
  const pattern = document.createElement('div');
  pattern.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
    pointer-events: none;
  `;
  
  backgroundContainer.appendChild(pattern);
  console.log('Gradient background applied successfully');
}

// Set fallback background when external images fail
function setFallbackBackground() {
  console.log('Setting fallback background...');
  
  // Clear any existing content immediately
  backgroundContainer.innerHTML = '';
  
  // List of local fallback backgrounds (CSS gradients and patterns)
  const fallbackBackgrounds = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #c471ed 0%, #f64f59 100%)'
  ];
  
  // Select a random fallback background
  const randomFallback = fallbackBackgrounds[Math.floor(Math.random() * fallbackBackgrounds.length)];
  
  // Apply the gradient background directly to the container
  backgroundContainer.style.background = randomFallback;
  
  // Force a style recalculation to ensure immediate application
  backgroundContainer.offsetHeight;
  
  // Create a subtle pattern overlay with a slight delay to ensure background is applied first
  setTimeout(() => {
    // Double-check that we haven't been replaced by a successful image load
    if (backgroundContainer.style.background === randomFallback) {
      const pattern = document.createElement('div');
      pattern.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: 
          radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
      `;
      
      backgroundContainer.appendChild(pattern);
      
      // Fade in the pattern
      setTimeout(() => {
        pattern.style.opacity = '1';
      }, 10);
    }
  }, 50);
  
  console.log('Fallback background applied:', randomFallback);
}

// Add debug information for background loading
function logBackgroundStatus() {
  console.log('Background container element:', backgroundContainer);
  console.log('Background container children:', backgroundContainer.children.length);
  console.log('Background container style:', backgroundContainer.style.background);
  
  const images = backgroundContainer.querySelectorAll('img');
  const videos = backgroundContainer.querySelectorAll('video');
  
  console.log('Images in background container:', images.length);
  console.log('Videos in background container:', videos.length);
  
  images.forEach((img, index) => {
    console.log(`Image ${index}:`, {
      src: img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    });
  });
}

// Submit name
async function submitName() {
  try {
    // Check if user has consented to cookies
    if (localStorage.getItem('cookie_consent') !== 'accepted') {
      alert('Please accept cookies to submit your name.');
      return;
    }
    
    const formData = new FormData(nameForm);
    formData.append('user_id', userId);
    
    const response = await fetch('/api/submit-name', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('Thank you for submitting your name!');
      nameForm.reset();
    } else {
      alert(`Error: ${data.error || 'Failed to submit name'}`);
    }
  } catch (error) {
    console.error('Error submitting name:', error);
    alert('Error submitting name. Please try again.');
  }
}

// Start stats polling
function startStatsPolling() {
  // Initial stats fetch
  fetchStats();
  
  // Clear any existing interval
  if (statsInterval) {
    clearInterval(statsInterval);
  }
  
  // Poll every 10 seconds
  statsInterval = setInterval(fetchStats, 10000);
}

// Fetch stats
async function fetchStats() {
  try {
    const response = await fetch('/api/stats');
    const data = await response.json();
    
    updateStatsDisplay(data);
    updateMap(data.countries);
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
}

// Update stats display
function updateStatsDisplay(data) {
  statsContainer.innerHTML = `
    <h3>Gospel Activations</h3>
    <p>Total: ${data.total.toLocaleString()}</p>
  `;
  
  // If we're in map view, update the map
  if (!mapView.classList.contains('hidden')) {
    updateMap(data.countries);
  }
}

// Update map
function updateMap(countries) {
  // Initialize the map if it doesn't exist
  if (!map) {
    initializeMap();
  }
  
  // Update the map with country data
  updateMapMarkers(countries);
  
  // Display top countries list
  displayTopCountries(countries);
}

// Initialize Leaflet map
function initializeMap() {
  // Create a map centered on the world
  map = L.map('map-container').setView([20, 0], 2);
  
  // Add a tile layer (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);
}

// Update map markers based on country data
function updateMapMarkers(countries) {
  // Clear existing markers
  map.eachLayer(layer => {
    if (layer instanceof L.Marker || layer instanceof L.Circle) {
      map.removeLayer(layer);
    }
  });
  
  // Country code to coordinates mapping (simplified)
  const countryCoordinates = {
    'US': [37.0902, -95.7129],
    'GB': [55.3781, -3.4360],
    'CA': [56.1304, -106.3468],
    'AU': [-25.2744, 133.7751],
    'FR': [46.2276, 2.2137],
    'DE': [51.1657, 10.4515],
    'IT': [41.8719, 12.5674],
    'ES': [40.4637, -3.7492],
    'JP': [36.2048, 138.2529],
    'BR': [-14.2350, -51.9253],
    'IN': [20.5937, 78.9629],
    'CN': [35.8617, 104.1954],
    'RU': [61.5240, 105.3188],
    'ZA': [-30.5595, 22.9375],
    'MX': [23.6345, -102.5528],
    'AR': [-38.4161, -63.6167],
    // Add more countries as needed
  };
  
  // Add markers for each country with data
  Object.entries(countries).forEach(([code, count]) => {
    if (countryCoordinates[code]) {
      // Size of circle based on count (logarithmic scale for better visualization)
      const radius = Math.max(50000, Math.log(count + 1) * 100000);
      
      // Create a circle marker
      L.circle(countryCoordinates[code], {
        color: '#4CAF50',
        fillColor: '#4CAF50',
        fillOpacity: 0.5,
        radius: radius
      }).bindPopup(`<strong>${code}</strong>: ${count.toLocaleString()} activations`).addTo(map);
    }
  });
}

// Display top countries in a list
function displayTopCountries(countries) {
  const topCountries = Object.entries(countries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  const countryNames = {
    'US': 'United States',
    'GB': 'United Kingdom',
    'CA': 'Canada',
    'AU': 'Australia',
    'FR': 'France',
    'DE': 'Germany',
    'IT': 'Italy',
    'ES': 'Spain',
    'JP': 'Japan',
    'BR': 'Brazil',
    'IN': 'India',
    'CN': 'China',
    'RU': 'Russia',
    'ZA': 'South Africa',
    'MX': 'Mexico',
    'AR': 'Argentina',
    // Add more as needed
  };
  
  topCountriesContainer.innerHTML = `
    <h3>Top 10 Countries</h3>
    <table class="country-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Country</th>
          <th>Activations</th>
        </tr>
      </thead>
      <tbody>
        ${topCountries.map(([code, count], index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${countryNames[code] || code}</td>
            <td>${count.toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Update URL with current language and version
function updateURL() {
  const url = new URL(window.location);
  url.searchParams.set('lang', currentLang);
  url.searchParams.set('version', currentVersion);
  window.history.replaceState({}, '', url);
}

// Switch to Bible verse view
function switchToVerseView() {
  verseViewBtn.classList.add('active');
  mapViewBtn.classList.remove('active');
  verseView.classList.remove('hidden');
  mapView.classList.add('hidden');
  
  // Pause stats polling to save resources
  if (statsInterval) {
    clearInterval(statsInterval);
    statsInterval = null;
  }
}

// Switch to map view
function switchToMapView() {
  verseViewBtn.classList.remove('active');
  mapViewBtn.classList.add('active');
  verseView.classList.add('hidden');
  mapView.classList.remove('hidden');
  
  // Initialize map if needed
  if (!map) {
    initializeMap();
  }
  
  // Force map to refresh size (needed after display:none -> display:block)
  if (map) {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }
  
  // Start stats polling if not already running
  if (!statsInterval) {
    fetchStats();
    statsInterval = setInterval(fetchStats, 10000);
  }
}
