'use strict';
(function () {

    class Page {
        constructor (options) {
            this.options = options;
        };

        render () {
            this.options.subheader.innerHTML = "Многопользовательский пинг-понг";
            this.options.content.innerHTML = window.render_index(this.options);
        };
    }

    module.exports.Page = Page;
})();
