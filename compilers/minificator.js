'use strict';

const uglifyjs = require("uglify-js");
const fs = require('fs');

const SOURCE = './dist/index_bundle.js';
const DEST = './dist/index_bundle.js';

(function () {
    console.log('minification_started');
    fs.writeFileSync(DEST, uglifyjs.minify(SOURCE).code);
    console.log('minification finished');
})();

