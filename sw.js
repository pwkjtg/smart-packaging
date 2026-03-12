const CACHE_NAME = 'pura-packaging-v3';

// Daftar file statik untuk akses offline
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo.svg',
  './logo-192.png',
  './logo-512.png',
  // PERBAIKAN SANGAT PENTING: Wajib tambahkan JS & CSS React!
  // Jika ini tidak ada, PWA akan blank putih saat offline.
  '/smart-packaging/assets/index-BK8PbsM0.js',
  '/smart-packaging/assets/index-DL_TCdeA.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});