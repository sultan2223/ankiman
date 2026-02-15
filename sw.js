const CACHE_NAME = 'anki-v1';
const urlsToCache = [
  './index.html',
  './init.html',
  './init.css',
  './init.js',
  './create_book.html',
  './create_book.css',
  './create_book.js',
  './main.html',
  './main.css',
  './main.js'
];

// Установка Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кэш открыт');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Ошибка при кэшировании:', err))
  );
});

// Активация Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Перехват запросов
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Вернуть из кэша, если есть
        if (response) {
          return response;
        }
        
        // Иначе взять из сети
        return fetch(event.request)
          .then(response => {
            // Не кэшировать при ошибке
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }
            
            // Клонировать ответ
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Использовать кэш при отсутствии интернета
            return caches.match(event.request);
          });
      })
  );
});
