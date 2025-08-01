// sw.js

// sw.js

const CACHE_NAME = 'todo-flow-cache-v2'; // Actualizado para forzar la actualización del Service Worker
const urlsToCache = [
  '.',
  'index.html',
  'manifest.json'
];

// Evento de instalación: precachear los recursos esenciales de la aplicación.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta y recursos precacheados');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de activación: limpiar cachés antiguas.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Evento de fetch: servir desde la caché primero, luego red (estrategia Cache-First).
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si la respuesta está en la caché, la devolvemos.
        if (response) {
          return response;
        }
        // Si no, hacemos la petición a la red, la usamos y la almacenamos en caché para futuras peticiones.
        return fetch(event.request).then(
          response => {
            // Comprobamos si recibimos una respuesta válida
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

