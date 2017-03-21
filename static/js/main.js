'use strict';
import {router} from './pages/main';

(function () {
    //const userpanel = document.querySelector(".js-top");

    //userpanel.innerHTML = pages.renderTop();


    router.renderAndSave(window.location.pathname);
    console.log(window.location.pathname);

    document.body.addEventListener('click', event => {
        let target = event.target;
        if (target.nodeName === "A" && target.dataset.page) {
            event.preventDefault();
            router.renderAndSave(target.dataset.page);
        }
    });

    window.addEventListener('popstate', event => {
        router.render(event.state.url, event.state);
    });

})();
