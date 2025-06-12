/**
 * Cookie Consent Manager for NFCBible
 * Handles GDPR-compliant cookie and localStorage consent
 */

class CookieConsentManager {
  constructor() {
    this.cookieBanner = document.getElementById('cookie-banner');
    this.acceptBtn = document.getElementById('accept-cookies');
    this.rejectBtn = document.getElementById('reject-cookies');
    this.customizeBtn = document.getElementById('customize-cookies');
    
    this.consentKey = 'cookie_consent';
    this.userIdKey = 'gospel_user_id';
    
    this.init();
  }
  
  init() {
    // Check if user has already made a choice
    const consent = localStorage.getItem(this.consentKey);
    
    if (!consent) {
      // Show the banner if no choice has been made
      this.showBanner();
    } else if (consent === 'accepted') {
      // If consent was given, initialize user ID if needed
      this.initializeUserId();
    }
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  showBanner() {
    this.cookieBanner.classList.remove('hidden');
  }
  
  hideBanner() {
    this.cookieBanner.classList.add('hidden');
  }
  
  setupEventListeners() {
    // Accept all cookies
    this.acceptBtn.addEventListener('click', () => {
      localStorage.setItem(this.consentKey, 'accepted');
      this.initializeUserId();
      this.hideBanner();
      this.enableGoogleAdsense();
    });
    
    // Reject non-essential cookies
    this.rejectBtn.addEventListener('click', () => {
      localStorage.setItem(this.consentKey, 'rejected');
      this.hideBanner();
      this.disableGoogleAdsense();
    });
    
    // Show customization options
    if (this.customizeBtn) {
      this.customizeBtn.addEventListener('click', () => {
        this.showCustomizationOptions();
      });
    }
  }
  
  initializeUserId() {
    // Only initialize if user has consented
    let userId = localStorage.getItem(this.userIdKey);
    
    if (!userId) {
      userId = this.generateUUID();
      localStorage.setItem(this.userIdKey, userId);
    }
    
    return userId;
  }
  
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  enableGoogleAdsense() {
    // Enable Google AdSense scripts
    // This is a placeholder - in a real implementation, you would
    // dynamically load the AdSense script here or enable it if already loaded
    console.log('Google AdSense enabled');
    
    // Example of dynamically loading AdSense script
    const adScript = document.createElement('script');
    adScript.async = true;
    adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ADSENSE_PUBLISHER_ID';
    adScript.crossOrigin = 'anonymous';
    document.head.appendChild(adScript);
    
    // Initialize ads
    if (window.adsbygoogle) {
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
  }
  
  disableGoogleAdsense() {
    // Disable Google AdSense
    // This is a placeholder - in a real implementation, you would
    // prevent AdSense from loading or hide ad containers
    console.log('Google AdSense disabled');
    
    // Hide ad containers
    const adContainers = document.querySelectorAll('.ad-container');
    adContainers.forEach(container => {
      container.style.display = 'none';
    });
  }
  
  showCustomizationOptions() {
    // Create and show a modal with customization options
    const modal = document.createElement('div');
    modal.className = 'cookie-modal';
    modal.innerHTML = `
      <div class="cookie-modal-content">
        <h2>Cookie Preferences</h2>
        <p>Choose which cookies you want to accept:</p>
        
        <div class="cookie-option">
          <input type="checkbox" id="essential-cookies" checked disabled>
          <label for="essential-cookies">Essential Cookies (Required)</label>
          <p>These cookies are necessary for the website to function and cannot be disabled.</p>
        </div>
        
        <div class="cookie-option">
          <input type="checkbox" id="analytics-cookies">
          <label for="analytics-cookies">Analytics Cookies</label>
          <p>These cookies help us understand how visitors interact with our website.</p>
        </div>
        
        <div class="cookie-option">
          <input type="checkbox" id="advertising-cookies">
          <label for="advertising-cookies">Advertising Cookies</label>
          <p>These cookies are used to show you relevant advertisements on and off our website.</p>
        </div>
        
        <div class="cookie-modal-buttons">
          <button id="save-preferences">Save Preferences</button>
          <button id="close-modal">Cancel</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles for the modal
    const style = document.createElement('style');
    style.textContent = `
      .cookie-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
      }
      
      .cookie-modal-content {
        background-color: #fff;
        color: #333;
        padding: 2rem;
        border-radius: 8px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
      }
      
      .cookie-option {
        margin: 1.5rem 0;
      }
      
      .cookie-modal-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 2rem;
      }
      
      .cookie-modal-buttons button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      
      #save-preferences {
        background-color: #4CAF50;
        color: white;
      }
      
      #close-modal {
        background-color: #f1f1f1;
        color: #333;
      }
    `;
    
    document.head.appendChild(style);
    
    // Set up event listeners for the modal
    const saveBtn = document.getElementById('save-preferences');
    const closeBtn = document.getElementById('close-modal');
    const analyticsCookies = document.getElementById('analytics-cookies');
    const advertisingCookies = document.getElementById('advertising-cookies');
    
    saveBtn.addEventListener('click', () => {
      // Save preferences
      const preferences = {
        analytics: analyticsCookies.checked,
        advertising: advertisingCookies.checked
      };
      
      localStorage.setItem(this.consentKey, 'customized');
      localStorage.setItem('cookie_preferences', JSON.stringify(preferences));
      
      // Initialize user ID if analytics is enabled
      if (preferences.analytics) {
        this.initializeUserId();
      }
      
      // Enable/disable AdSense based on advertising preference
      if (preferences.advertising) {
        this.enableGoogleAdsense();
      } else {
        this.disableGoogleAdsense();
      }
      
      // Remove modal and hide banner
      document.body.removeChild(modal);
      document.head.removeChild(style);
      this.hideBanner();
    });
    
    closeBtn.addEventListener('click', () => {
      // Remove modal without saving
      document.body.removeChild(modal);
      document.head.removeChild(style);
    });
  }
  
  // Get the current consent status
  getConsentStatus() {
    return localStorage.getItem(this.consentKey);
  }
  
  // Check if a specific type of cookie is allowed
  isAllowed(type) {
    const consent = this.getConsentStatus();
    
    if (consent === 'accepted') {
      return true;
    }
    
    if (consent === 'rejected') {
      return false;
    }
    
    if (consent === 'customized') {
      const preferences = JSON.parse(localStorage.getItem('cookie_preferences') || '{}');
      return preferences[type] === true;
    }
    
    return false;
  }
}

// Initialize the consent manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.cookieConsent = new CookieConsentManager();
});
