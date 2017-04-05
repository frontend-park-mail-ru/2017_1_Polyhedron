'use strict';
import {router} from './pages/main';
import {Top} from './components/top/top';

(function () {
    window.userpanel = new Top();
    window.userpanel.render();


    router.renderAndSave(window.location.pathname);

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

