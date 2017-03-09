'use strict';

(function () {
    //window.user = {name: 'Player 2', score: '197'};
    const pages = require('./pages/pages');
    const userpanel = document.querySelector(".js-top");

    userpanel.innerHTML = pages.render_top();

    pages.index.render();

    document.body.addEventListener('click', event => {
        let target = event.target;
        if (target.nodeName == "A" && target.dataset.page) {
            event.preventDefault();
            pages.switch_page(target.dataset.page);
        }
    });

})();

