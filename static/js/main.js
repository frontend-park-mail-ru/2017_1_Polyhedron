'use strict';
import {router} from './pages/main';
import {BackendAPI} from '../../core/client_side/site_service/backend_api'
import {Top} from './components/top/top';

(function () {
    window.backendAPI = new BackendAPI();
    window.userpanel = new Top();
    window.userpanel.render();
    window.router = router;

    router.renderAndSave(window.location.pathname);

    document.body.addEventListener('click', event => {
        let target = event.target;
        if (target.nodeName === "A")
            if (target.dataset.page) {
                event.preventDefault();
                if (target.dataset.page === "logout") {
                    window.userpanel.logout();
                    router.renderAndSave("/");
                }
                else
                    router.renderAndSave(target.dataset.page);
            }
    });

    window.addEventListener('popstate', event => {
        router.render(event.state.url, event.state);
    });

})();

