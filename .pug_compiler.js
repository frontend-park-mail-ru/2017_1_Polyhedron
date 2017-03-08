
const TEMPLATE_DIR = './static/js/templates';
const RESULT_DIR = './templates';
const compileAll = require('./core/template_compilation');

(function () {
    compileAll('./static/js/templates', './templates');
})();