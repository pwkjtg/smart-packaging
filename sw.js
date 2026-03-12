const CACHE_NAME = 'pura-packaging-v1';

// Daftar file statis yang ingin disimpan agar bisa loading cepat & offline
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo.svg'
];

// Event INSTALL: Menyimpan file-file penting ke Cache Browser
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Event FETCH: Mencegat request dari aplikasi, berikan dari cache jika ada
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika file ada di cache, kembalikan file tersebut (cepat & hemat kuota)
        if (response) {
          return response;
        }
        // Jika tidak ada di cache, ambil dari internet aslinya
        return fetch(event.request);
      })
  );
});

// Event ACTIVATE: Membersihkan cache versi lama jika ada update
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});