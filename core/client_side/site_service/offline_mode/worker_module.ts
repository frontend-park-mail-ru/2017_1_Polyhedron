

export function loadWorker(scriptURL) {
    navigator.serviceWorker.register(scriptURL)
        .then((registration) => {
        // console.log('ServiceWorker registration', registration); // TODO set up proper logging
    }).catch((err) => {
        throw new Error('ServiceWorker error: ' + err);
    });
}
