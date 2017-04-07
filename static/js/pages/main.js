'use strict';

import {About} from './about';
import {ChoiceGameMode} from './choice';
import {Game} from './game';
import {Error} from './error404';
import {Index} from './index';
import {Leaders} from './leaders';
import {Login} from './login';
import {Signup} from './signup';
import {Waiting} from './waiting';
import {Logout} from './logout';

import * as pugRuntime from '../../../node_modules/pug-runtime/index';

import {Router} from '../../../core/client_side/site_service/router';


const content = document.querySelector(".js-content");
const heading = document.querySelector(".js-subheader");

for (let key in pugRuntime) {
    window['pug_' + key] = pugRuntime[key];  // TODO get rid of setting to window (temporary solution).
}

export let router = new Router({
    '^/?$': new Index(heading, content),

    '^/?index$': new Index(heading, content),
    '^/?about$': new About(heading, content),
    '^/?choice$': new ChoiceGameMode(heading, content),
    '^/?game$': new Game(heading, content),
    '^/?leaders$': new Leaders(heading, content, {count: 10}),
    '^/?login$': new Login(heading, content),
    '^/?logout$': new Logout(),
    '^/?signup$': new Signup(heading, content),
    '^/?waiting$': new Waiting(heading, content),
}, new Error(heading, content));
