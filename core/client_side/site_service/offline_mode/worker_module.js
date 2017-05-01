"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function loadWorker(scriptURL) {
    navigator.serviceWorker.register(scriptURL)
        .then((registration) => {
        // console.log('ServiceWorker registration', registration); // TODO set up proper logging
    }).catch((err) => {
        throw new Error('ServiceWorker error: ' + err);
    });
}
exports.loadWorker = loadWorker;
//# sourceMappingURL=worker_module.js.map