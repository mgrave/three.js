// Nombre de la caché
const CACHE_NAME = 'dice-cache-v1';

// Archivos a guardar en caché
// Asegúrate de que todas las rutas sean correctas
const urlsToCache = [
  '/', // La raíz, usualmente tu index.html
  'index.html',
  'main.css',
  '../build/three.module.js',
  './jsm/controls/OrbitControls.js',
  './jsm/geometries/RoundedBoxGeometry.js',
  'https://cdnjs.cloudflare.com/ajax/libs/tween.js/20.0.3/tween.umd.js',
  'https://cdn.jsdelivr.net/npm/dat.gui@0.7.7/build/dat.gui.module.js',
  'textures/crate.gif',
  'textures/dice1.png',
  'textures/dice2.png',
  'textures/dice3.png',
  'textures/dice4.png',
  'textures/dice5.png',
  'textures/dice6.png',
  'sounds/toss.mp3',
  'sounds/impact.mp3',
  'images/icon-192x192.png',
  'images/icon-512x512.png'
];

// Evento 'install': se dispara cuando el Service Worker se instala.
// Aquí abrimos la caché y guardamos nuestros archivos.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': se dispara cada vez que la página solicita un recurso.
// Intentamos servir desde la caché primero, si no, vamos a la red.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si encontramos una respuesta en la caché, la devolvemos
        if (response) {
          return response;
        }
        // Si no, hacemos la petición a la red
        return fetch(event.request);
      }
    )
  );
});

// Evento 'activate': se dispara cuando el Service Worker se activa.
// Aquí se suelen limpiar cachés antiguas.
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