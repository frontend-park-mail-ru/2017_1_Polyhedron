
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

        plainUrls: [
            '/', '/index', '/about', '/choice', '/game', '/battle', '/gameover',
            '/leaders', '/login', '/signup', '/waiting', '/404'
        ]
    });
    console.log('Cached URL generation finished');
})();
