const CACHE_NAME = "matriz-app-v2"; // 👉 Cambia este nombre cada vez que publiques cambios

const ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/manifest.json"
];


// 🔹 Instalación: guarda archivos en caché
self.addEventListener("install", event => {
  self.skipWaiting(); // activa inmediatamente la nueva versión

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});


// 🔹 Activación: elimina cachés antiguas
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim(); // toma control inmediato
});


// 🔹 Estrategia de actualización: Network first
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // guarda copia en caché
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
