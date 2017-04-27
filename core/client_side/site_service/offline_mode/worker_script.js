'use strict';

const CACHE_NAME = 'cache_v_1';
const INFO_URL = 'http://localhost:3000/cached_urls';  // TODO remove


self.addEventListener('install', event => {
    console.log('install', event);
});


self.addEventListener('activate', event => {
    console.log('activate', event);
});


self.addEventListener('install', event => {
    event.waitUntil(
        fetch(INFO_URL)
            .then(response => response.json())
            .then(cacheURLs => {
                caches.open(CACHE_NAME)
                    .then(cache => cache.addAll(cacheURLs.concat(['/cached_page'])));
            })
        );
});


self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(cachedResponse) {

            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request);
        })
    );
});

