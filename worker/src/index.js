// Cloudflare Worker code for the Gospel Reach Me Application

// Global Counter Durable Object
export class GlobalCounter {
  constructor(state, env) {
    this.state = state;
    this.storage = state.storage;
  }

  async fetch(request) {
    const url = new URL(request.url);
    
    // Get current counts
    let totalCount = (await this.storage.get('total_count')) || 0;
    let countryCounts = (await this.storage.get('country_counts')) || {};
    
    if (url.pathname === '/increment') {
      // Get country from query parameter
      const country = url.searchParams.get('country');
      
      // Increment total count
      totalCount++;
      
      // Increment country-specific count if country is provided
      if (country) {
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      }
      
      // Store updated counts
      await this.storage.put('total_count', totalCount);
      await this.storage.put('country_counts', countryCounts);
      
      // Return updated counts
      return new Response(
        JSON.stringify({ total: totalCount, countries: countryCounts }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    } else if (url.pathname === '/get') {
      // Return current counts
      return new Response(
        JSON.stringify({ total: totalCount, countries: countryCounts }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response('Not found', { status: 404 });
  }
}

// Main Worker handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Set CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    // Handle OPTIONS request (CORS preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }
    
    // API routes
    if (path.startsWith('/api/')) {
      // Set common response headers for API routes
      const responseInit = {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      };
      
      try {
        // Language configuration endpoint
        if (path === '/api/config' && request.method === 'GET') {
          const params = new URL(request.url).searchParams;
          const langCode = params.get('lang') || 'EN';
          
          // Get language config from KV
          const langConfig = await env.BIBLE_TEXT_KV.get(`language_${langCode}`, { type: 'json' });
          
          if (!langConfig) {
            return new Response(
              JSON.stringify({ error: 'Language not found' }),
              { ...responseInit, status: 404 }
            );
          }
          
          return new Response(JSON.stringify(langConfig), responseInit);
        }
        
        // Get all languages endpoint
        if (path === '/api/languages' && request.method === 'GET') {
          // In a real implementation, you would fetch this from KV
          // For now, we'll use the hard-coded languages data from worker/src/data/languages.json
          
          // This would be replaced with: const languages = await env.BIBLE_TEXT_KV.get('all_languages', { type: 'json' });
          const languages = [
            {
              code: 'EN',
              name: 'English',
              defaultVersion: 'KJV',
              versions: {
                KJV: 'King James Version',
                NIV: 'New International Version',
                ESV: 'English Standard Version'
              }
            },
            {
              code: 'FR',
              name: 'French',
              defaultVersion: 'LSG',
              versions: {
                LSG: 'Louis Segond 1910',
                BDS: 'La Bible du Semeur'
              }
            },
            {
              code: 'ES',
              name: 'Spanish',
              defaultVersion: 'RVR60',
              versions: {
                RVR60: 'Reina-Valera 1960',
                NVI: 'Nueva Version Internacional'
              }
            },
            {
              code: 'DE',
              name: 'German',
              defaultVersion: 'LUTH2017',
              versions: {
                LUTH2017: 'Lutherbibel 2017',
                ELB: 'Elberfelder Bibel'
              }
            },
            {
              code: 'IT',
              name: 'Italian',
              defaultVersion: 'CEI',
              versions: {
                CEI: 'Conferenza Episcopale Italiana',
                NR94: 'Nuova Riveduta 1994'
              }
            }
          ];
          
          return new Response(JSON.stringify(languages), responseInit);
        }
        
        // Random verse endpoint
        if (path === '/api/verse' && request.method === 'GET') {
          const params = new URL(request.url).searchParams;
          const langCode = params.get('lang') || 'EN';
          const versionCode = params.get('version') || 'KJV';
          
          // Get a random verse index (1-365)
          const verseIndex = String(Math.floor(Math.random() * 365) + 1).padStart(3, '0');
          
          // Construct the KV key
          const verseKey = `bible_text_${langCode}_${versionCode}_${verseIndex}`;
          
          // Fetch the verse from KV
          const verse = await env.BIBLE_TEXT_KV.get(verseKey, { type: 'json' });
          
          if (!verse) {
            return new Response(
              JSON.stringify({ error: 'Verse not found' }),
              { ...responseInit, status: 404 }
            );
          }
          
          // Increment the counter
          const counterKey = env.GLOBAL_COUNTER_DO.idFromName('main_counter');
          const counter = env.GLOBAL_COUNTER_DO.get(counterKey);
          
          // Get country code from Cloudflare headers
          const country = request.headers.get('CF-IPCountry') || 'XX';
          
          // Increment the counter in the background
          ctx.waitUntil(
            counter.fetch(new URL(`/increment?country=${country}`, request.url))
          );
          
          return new Response(JSON.stringify(verse), responseInit);
        }
        
        // Random background endpoint
        if (path === '/api/random-background' && request.method === 'GET') {
          // 高质量可靠的Unsplash图片（经过验证的稳定链接）
          const backgrounds = [
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1464822759844-d150baec3014?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
            },
            // 可靠的CSS渐变背景（确保总有备用方案）
            {
              type: 'gradient',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            },
            {
              type: 'gradient', 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
            },
            {
              type: 'gradient',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
            },
            {
              type: 'gradient',
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
            },
            {
              type: 'gradient',
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
            },
            {
              type: 'gradient',
              background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
            },
            {
              type: 'gradient',
              background: 'linear-gradient(135deg, #c471ed 0%, #f64f59 100%)'
            },
            {
              type: 'gradient',
              background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
            },
            {
              type: 'gradient',
              background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
            }
          ];
          
          // Select a random background
          const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
          
          return new Response(JSON.stringify(randomBackground), {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
              ...corsHeaders,
            },
          });
        }
        
        // Geo-detection endpoint
        if (path === '/api/geo-detect' && request.method === 'GET') {
          // Get country code from Cloudflare headers
          const country = request.headers.get('CF-IPCountry') || 'US';
          
          // Map countries to languages
          const countryToLanguage = {
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
          
          const suggestedLanguage = countryToLanguage[country] || 'EN';
          
          return new Response(JSON.stringify({
            country: country,
            suggestedLanguage: suggestedLanguage
          }), responseInit);
        }

        // Stats endpoint
        if (path === '/api/stats' && request.method === 'GET') {
          // Get the global counter Durable Object
          const counterKey = env.GLOBAL_COUNTER_DO.idFromName('main_counter');
          const counter = env.GLOBAL_COUNTER_DO.get(counterKey);
          
          // Fetch the current stats
          const response = await counter.fetch(new URL('/get', request.url));
          const stats = await response.json();
          
          return new Response(JSON.stringify(stats), responseInit);
        }
        
        // Name submission endpoint
        if (path === '/api/submit-name' && request.method === 'POST') {
          // Parse the request body
          const formData = await request.formData();
          const userName = formData.get('user_name');
          const userId = formData.get('user_id');
          const turnstileToken = formData.get('token');
          
          // Validate required fields
          if (!userName || !userId || !turnstileToken) {
            return new Response(
              JSON.stringify({ error: 'Missing required fields' }),
              { ...responseInit, status: 400 }
            );
          }
          
          // Verify Turnstile token
          const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              secret: env.TURNSTILE_SECRET_KEY,
              response: turnstileToken,
            }),
          });
          
          const turnstileResult = await turnstileResponse.json();
          
          if (!turnstileResult.success) {
            return new Response(
              JSON.stringify({ error: 'CAPTCHA verification failed' }),
              { ...responseInit, status: 403 }
            );
          }
          
          // Store the user name submission in KV
          const submission = {
            name: userName,
            timestamp: new Date().toISOString(),
          };
          
          await env.USER_SUBMISSIONS_KV.put(`user_submission_${userId}`, JSON.stringify(submission));
          
          return new Response(
            JSON.stringify({ success: true }),
            responseInit
          );
        }
        
        // If no API route matches
        return new Response(
          JSON.stringify({ error: 'Endpoint not found' }),
          { ...responseInit, status: 404 }
        );
        
      } catch (error) {
        // Log the error (in a real implementation, you'd use a proper logging solution)
        console.error(`API Error: ${error.message}`);
        
        // Return a generic error response
        return new Response(
          JSON.stringify({ error: 'Internal server error' }),
          { ...responseInit, status: 500 }
        );
      }
    }
    
    // For all other routes, serve the frontend
    // In a real implementation, this would be handled by Cloudflare Pages
    // or by serving static assets from your Worker
    
    // For now, we'll just return a simple response
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>NFC Gospel</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 20px; }
          </style>
        </head>
        <body>
          <h1>Gospel Reach Me Worker</h1>
          <p>This is the Cloudflare Worker for the Gospel Reach Me application.</p>
          <p>The frontend should be served from Cloudflare Pages.</p>
        </body>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
          ...corsHeaders,
        },
      }
    );
  },
};