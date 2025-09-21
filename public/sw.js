// Enhanced Service Worker for Weather App
// Provides offline capabilities and intelligent caching

const CACHE_NAME = 'weather-app-v1';
const WEATHER_CACHE_NAME = 'weather-data-v1';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes for weather data

// Resources to cache immediately
const STATIC_RESOURCES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico'
];

// Weather API endpoints to cache
const WEATHER_API_PATTERNS = [
  /api\.openweathermap\.org\/data\/3\.0\/onecall/,
  /api\.openweathermap\.org\/geo\/1\.0/
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static resources');
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== WEATHER_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle weather API requests with network-first strategy
  if (WEATHER_API_PATTERNS.some(pattern => pattern.test(request.url))) {
    event.respondWith(handleWeatherRequest(request));
    return;
  }

  // Handle static resources with cache-first strategy
  if (request.method === 'GET') {
    event.respondWith(handleStaticRequest(request));
    return;
  }
});

// Network-first strategy for weather data
async function handleWeatherRequest(request) {
  const cache = await caches.open(WEATHER_CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses with timestamp
      const responseClone = networkResponse.clone();
      const responseWithTimestamp = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: {
          ...responseClone.headers,
          'sw-cached-at': Date.now().toString()
        }
      });
      
      cache.put(request, responseWithTimestamp);
      return networkResponse;
    }
  } catch (error) {
    console.log('Service Worker: Network request failed, trying cache', error);
  }

  // Fallback to cache
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    const cachedAt = cachedResponse.headers.get('sw-cached-at');
    const isExpired = cachedAt && (Date.now() - parseInt(cachedAt)) > CACHE_DURATION;
    
    if (!isExpired) {
      console.log('Service Worker: Serving from cache');
      return cachedResponse;
    } else {
      console.log('Service Worker: Cache expired, removing');
      cache.delete(request);
    }
  }

  // Return offline fallback
  return new Response(
    JSON.stringify({
      error: 'Weather data unavailable offline',
      offline: true
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Cache-first strategy for static resources
async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Failed to fetch resource', request.url, error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return cache.match('/') || new Response('Offline', { status: 503 });
    }
    
    throw error;
  }
}

// Handle background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'weather-sync') {
    event.waitUntil(syncWeatherData());
  }
});

async function syncWeatherData() {
  console.log('Service Worker: Syncing weather data in background');
  // Implementation for background sync would go here
}

// Handle push notifications (for future weather alerts)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Weather Alert', {
        body: data.body || 'Check the latest weather conditions',
        icon: '/logo192.png',
        badge: '/favicon.ico',
        tag: 'weather-notification',
        requireInteraction: false,
        actions: [
          {
            action: 'view',
            title: 'View Weather'
          }
        ]
      })
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

console.log('Service Worker: Script loaded');
