'use strict';
import {pages, switchPage} from './pages/main';

(function () {
    const userpanel = document.querySelector(".js-top");

    userpanel.innerHTML = pages.renderTop();

    pages.index.render();

    document.body.addEventListener('click', event => {
        let target = event.target;
        if (target.nodeName === "A" && target.dataset.page) {
            event.preventDefault();
            switchPage(target.dataset.page);
        }
    });

})();
