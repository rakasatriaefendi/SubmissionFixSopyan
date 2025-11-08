const CACHE_NAME = 'storymap-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/main.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/screenshots/home.png',
  '/screenshots/add-story.png'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If offline, return cached index.html
          return caches.match('/index.html');
        })
    );
    return;
  }

  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('push', (event) => {
  console.log('Service Worker: Push Received.');

  let notificationData = {
    title: 'Notifikasi Baru',
    options: {
      body: 'Anda memiliki pesan baru di StoryMap App.',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      vibrate: [200, 100, 200],
      tag: 'storymap-push', // Prevent duplicate notifications
    },
  };

  if (event.data) {
    try {
      const dataAsJson = event.data.json();
      notificationData.title = dataAsJson.title || notificationData.title;
      notificationData.options.body = dataAsJson.body || notificationData.options.body;
    } catch (e) {
      notificationData.options.body = event.data.text();
    }
  }

  const { title, options } = notificationData;
  event.waitUntil(self.registration.showNotification(title, options));
});
