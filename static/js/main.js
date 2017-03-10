'use strict';

(function () {
    require('../js/new_validate');

    //window.user = {name: 'Player 2', score: '197'};
    const pages = require('./pages/main');
    const userpanel = document.querySelector(".js-top");

    userpanel.innerHTML = pages.renderTop();

    pages.index.render();

    document.body.addEventListener('click', event => {
        let target = event.target;
        if (target.nodeName === "A" && target.dataset.page) {
            event.preventDefault();
            pages.switchPage(target.dataset.page);
        }
    });

})();
