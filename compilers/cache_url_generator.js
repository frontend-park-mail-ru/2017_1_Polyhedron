
const caching = require('../core/server_side/service/caching');

const OUTPUT = './static/cached_urls';

(function () {
    console.log('Cached URL generation started');
    caching.saveCachedUrls(OUTPUT, {
        foldersInfo: [
            ['./static/fonts', '/static/fonts/'],
            ['./static/images', '/static/images/'],

            ['./dist', '/dist/']
        ],

        plainUrls: ['/']
    });
    console.log('Cached URL generation finished');
})();
