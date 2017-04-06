
"use strict";

const TEMPLATE_DIR = './templates';
const RESULT_DIR = './static/js/templates';
const compileAll = require('./../core/server_side/service/template_compilation');

(function () {
    compileAll(TEMPLATE_DIR, RESULT_DIR);
})();