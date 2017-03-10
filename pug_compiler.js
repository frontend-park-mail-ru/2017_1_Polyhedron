
const TEMPLATE_DIR = './templates';
const RESULT_DIR = './static/js/templates';
const compileAll = require('./core/template_compilation');

(function () {
    compileAll(TEMPLATE_DIR, RESULT_DIR);
})();