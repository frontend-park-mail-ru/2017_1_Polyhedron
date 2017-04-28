'use strict';
import {router} from './pages/main';
import {Top} from './components/top/top';
import {Autowired} from "../../core/client_side/game_mechanics/experimental/decorators";
import {VariableMap} from "../../core/client_side/game_mechanics/experimental/context";
import {loadWorker} from "../../core/client_side/site_service/offline_mode/worker_module";


(() => {
    class Starter {
        @Autowired(VariableMap)
        private variableMap: VariableMap;
        private userpanel: Top = new Top();

        public start() {
            this.variableMap.setVariable('userpanel', this.userpanel);
            this.variableMap.setVariable('router', router);

            router.renderAndSave(window.location.pathname);

            document.body.addEventListener('click', event => {
                const target = event.target as any; // TODO strange: need to make typecast

                if (target.nodeName === "A" && target.dataset.page) {
                    event.preventDefault();
                    if (target.dataset.page === "logout") {
                        this.userpanel.logout();
                        router.renderAndSave("/");
                    } else {
                        router.renderAndSave(target.dataset.page);
                    }

                    if (target.dataset.page === "game") {
                        this.launchIntoFullscreen(document.querySelector('#game'));
                    }
                }
            });

            window.addEventListener('popstate', event => {
                router.render(event.state.url, event.state);
            });
        }

        private launchIntoFullscreen(element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }
    }

    const starter = new Starter();
    starter.start();
    loadWorker('/worker_script.js');
})();

