// sw.js

// sw.js

const CACHE_NAME = "todo-flow-cache-v2"; // <-- Cambia el nombre para forzar la actualización
const urlsToCache = [
  "/mi_todo_app/", // <-- ¡SOLUCIÓN! Ruta al directorio raíz de tu app
  "/mi_todo_app/index.html", // <-- ¡SOLUCIÓN! Ruta completa al archivo principal
  "https://unpkg.com/lucide@latest", // Esto está bien porque es una URL completa
];

// Evento de instalación: se dispara cuando el SW se instala.
self.addEventListener("install", (event) => {
  // Esperamos hasta que la promesa se resuelva.
  event.waitUntil(
    // Abrimos la caché con el nombre que definimos.
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache abierta");
      // Añadimos todos los archivos de nuestra lista a la caché.
      return cache.addAll(urlsToCache);
    }),
  );
});

// Evento de fetch: se dispara cada vez que la app pide un recurso (una imagen, un script, etc.).
self.addEventListener("fetch", (event) => {
  event.respondWith(
    // Buscamos si la petición ya está en la caché.
    caches.match(event.request).then((response) => {
      // Si la respuesta está en la caché, la devolvemos.
      if (response) {
        return response;
      }
      // Si no, hacemos la petición a la red como siempre.
      return fetch(event.request);
    }),
  );
});

