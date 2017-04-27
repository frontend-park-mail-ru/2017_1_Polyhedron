

export function loadWorker(scriptURL) {
    navigator.serviceWorker.register(scriptURL)
        .then(function(registration) {
        console.log('ServiceWorker registration', registration);
    }).catch(function(err) {
        throw new Error('ServiceWorker error: ' + err);
    });
}
