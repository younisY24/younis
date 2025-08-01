const CACHE_NAME = 'gharadi-v1.0.1';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(['/', 'index.html', 'manifest.json'])
    )
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key =>
        key !== CACHE_NAME ? caches.delete(key) : null
      ))
    )
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request).catch(() =>
      caches.match(e.request).then(res => res || caches.match('/'))
    )
  );
});
