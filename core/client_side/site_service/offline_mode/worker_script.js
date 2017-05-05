'use strict';
const CACHE_NAME = 'cache_v_1';
const INFO_URL = 'http://polyhedron-team.herokuapp.com/cached_urls';
self.addEventListener('install', event => {
    event.waitUntil(fetch(INFO_URL)
        .then(response => response.json())
        .then(cacheURLs => {
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(cacheURLs));
    }));
});
self.addEventListener('fetch', event => {
    // TODO maybe need to enable cors (check after deploy to heroku)
    const lastModifiedPromise = fetch(event.request.url, {
        method: 'HEAD'
    })
        .then(response => response.headers.get('Last-Modified'))
        .catch(err => null);
    const cachedResponsePromise = caches.match(event.request);
    event.respondWith(Promise
        .all([lastModifiedPromise, cachedResponsePromise])
        .then(([lastModified, cachedResponse]) => {
        if (cachedResponse) {
            if (!lastModified || new Date(lastModified).getTime() < Date.now()) {
                return cachedResponse;
            }
        }
        return fetch(event.request);
    }));
});
//# sourceMappingURL=worker_script.js.map