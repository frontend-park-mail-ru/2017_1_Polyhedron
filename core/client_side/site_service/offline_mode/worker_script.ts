'use strict';

const CACHE_NAME = 'cache_v_1';
const INFO_URL = '/cached_urls';


self.addEventListener('install', event => {
    (event as any).waitUntil(
        fetch(INFO_URL)
            .then(response => response.json())
            .then(cacheURLs => {
                caches.open(CACHE_NAME)
                    .then(cache => cache.addAll(cacheURLs as any));
            })
        );
});


self.addEventListener('fetch', event => {
    // TODO maybe need to enable cors (check after deploy to heroku)
    const lastModifiedPromise = fetch((event as any).request.url, {
        method: 'HEAD'
    })
        .then(response => response.headers.get('Last-Modified'))
        .catch(err => null);
    const cachedResponsePromise = caches.match((event as any).request);

    (event as any).respondWith(
        Promise
            .all([lastModifiedPromise, cachedResponsePromise])
            .then(
                ([lastModified, cachedResponse]) => {
                    if (cachedResponse) {
                        if (!lastModified || new Date(lastModified).getTime() < Date.now()) {
                            return cachedResponse;
                        }
                    }

                    return fetch((event as any).request);
                }
            )
    );
});

