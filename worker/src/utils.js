/**
 * Generates a UUID v4
 * @returns {string} A UUID v4 string
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Gets a random item from an array
 * @param {Array} array - The array to select from
 * @returns {*} A random item from the array
 */
export function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Gets a random integer between min and max (inclusive)
 * @param {number} min - The minimum value
 * @param {number} max - The maximum value
 * @returns {number} A random integer between min and max
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Maps a country code to a default language
 * @param {string} countryCode - ISO country code
 * @returns {string} Language code (EN, FR, IT, ES, DE)
 */
export function mapCountryToLanguage(countryCode) {
  // French-speaking countries
  if (['FR', 'BE', 'CH', 'LU', 'MC', 'CI', 'SN', 'ML', 'NE', 'BF', 'TG', 'BJ', 'GA', 'CD', 'MG', 'CM', 'DJ', 'RW', 'BI', 'KM', 'SC', 'MU', 'HT'].includes(countryCode)) {
    return 'FR';
  }
  
  // Italian-speaking countries
  if (['IT', 'SM', 'VA', 'CH'].includes(countryCode)) {
    return 'IT';
  }
  
  // Spanish-speaking countries
  if (['ES', 'MX', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'SV', 'NI', 'CR', 'PA', 'UY', 'PR', 'PY', 'GQ', 'US'].includes(countryCode)) {
    return 'ES';
  }
  
  // German-speaking countries
  if (['DE', 'AT', 'CH', 'LI', 'LU', 'BE'].includes(countryCode)) {
    return 'DE';
  }
  
  // Default to English
  return 'EN';
}

/**
 * Sanitizes user input to prevent XSS
 * @param {string} input - The user input to sanitize
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Creates a response with CORS headers
 * @param {Object|string} body - Response body
 * @param {Object} options - Response options
 * @returns {Response} Response with CORS headers
 */
export function corsResponse(body, options = {}) {
  const { status = 200, headers = {} } = options;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  const responseHeaders = {
    ...corsHeaders,
    ...headers,
  };
  
  // If body is an object, stringify it and set Content-Type to application/json
  if (typeof body === 'object') {
    responseHeaders['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }
  
  return new Response(body, {
    status,
    headers: responseHeaders,
  });
}
