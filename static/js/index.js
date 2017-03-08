'use strict';

(function () {
    const Page = require('/static/js/page').Page;
    class Index extends Page {
        render () {
            this.options.subheader.innerHTML = "Многопользовательский пинг-понг";
            this.options.content.innerHTML = window.render_index(this.options);
        };
    }

    module.exports.Index = Index;
})();
