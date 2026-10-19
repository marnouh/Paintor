// Regard - Service Worker
const APP_CACHE_NAME = 'regard-app-v2';
const IMAGES_CACHE_NAME = 'regard-images-v2';
const AUDIO_CACHE_NAME = 'regard-audio-v2';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const allowedCaches = [APP_CACHE_NAME, IMAGES_CACHE_NAME, AUDIO_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => !allowedCaches.includes(key)).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isImage = 
    event.request.destination === 'image' ||
    url.pathname.match(/\.(jpg|jpeg|png|webp|svg|gif)$/i) ||
    url.hostname.includes('googleusercontent.com') ||
    url.hostname.includes('wikimedia.org') ||
    url.hostname.includes('metmuseum.org');

  const isAudio = 
    event.request.destination === 'audio' ||
    url.pathname.startsWith('/audio/') ||
    url.pathname.endsWith('.wav') ||
    url.pathname.endsWith('.mp3');

  // 1. Handling Images (Cache-first with network fallback & opaque response support)
  if (isImage) {
    event.respondWith(
      caches.open(IMAGES_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(event.request);
          // Cache successful response OR opaque response (cross-origin images)
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (fetchErr) {
          // If offline and not in cache, fallback
          return cachedResponse || new Response('', { status: 408, statusText: 'Offline - Image Not Cached' });
        }
      })
    );
    return;
  }

  // 2. Handling Audio (Cache-first with network fallback)
  if (isAudio) {
    event.respondWith(
      caches.open(AUDIO_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (fetchErr) {
          return cachedResponse || new Response('', { status: 408, statusText: 'Offline - Audio Not Cached' });
        }
      })
    );
    return;
  }

  // 3. Handling Navigation and standard assets (Network first with cache fallback)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse && event.request.mode !== 'navigate') {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(APP_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});

// Real Notification click handling (opens/focuses app and navigates to artwork)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const artworkId = event.notification.data?.artworkId;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          if (artworkId && 'postMessage' in client) {
            client.postMessage({ type: 'OPEN_ARTWORK_FROM_NOTIFICATION', artworkId });
          }
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(artworkId ? `/?artworkId=${artworkId}` : '/');
      }
    })
  );
});

self.addEventListener('notificationclose', (_event) => {
  // Notification dismissed by user
});

// Handle offline cache control commands from the client app
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || !data.type) return;

  if (data.type === 'CACHE_URLS') {
    const urls = data.urls || [];
    const cacheType = data.cacheType === 'audio' ? AUDIO_CACHE_NAME : IMAGES_CACHE_NAME;
    
    event.waitUntil(
      caches.open(cacheType).then(async (cache) => {
        let successCount = 0;
        for (const url of urls) {
          try {
            const resp = await fetch(url, { mode: 'no-cors' });
            if (resp) {
              await cache.put(url, resp);
              successCount++;
            }
          } catch (e) {
            // ignore individual asset failure
          }
        }
        if (event.source) {
          event.source.postMessage({
            type: 'CACHE_URLS_COMPLETE',
            successCount,
            total: urls.length,
            cacheType
          });
        }
      })
    );
  }

  if (data.type === 'CLEAR_MEDIA_CACHE') {
    event.waitUntil(
      Promise.all([
        caches.delete(IMAGES_CACHE_NAME),
        caches.delete(AUDIO_CACHE_NAME),
      ]).then(() => {
        if (event.source) {
          event.source.postMessage({ type: 'MEDIA_CACHE_CLEARED' });
        }
      })
    );
  }
});
