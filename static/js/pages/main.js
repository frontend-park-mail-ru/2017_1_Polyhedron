'use strict';

import {About} from './about';
import {Choice} from './choice';
import {Game} from './game';
import {Error} from './error404';
import {Index} from './index';
import {Leaders} from './leaders';
import {Login} from './login';
import {Signup} from './signup';
import {Waiting} from './waiting';

import * as renderAbout from '../templates/render_about';
import * as renderChoice from '../templates/render_choice';
import * as renderGame from '../templates/render_game';
import * as renderError404 from '../templates/render_error404';
import * as renderIndex from '../templates/render_index';
import * as renderLeaders from '../templates/render_leaders';
import * as renderLogin from '../templates/render_login';
import * as renderSignup from '../templates/render_signup';
import * as renderWaiting from '../templates/render_waiting';
import * as pugRuntime from '../../../node_modules/pug-runtime/index';

import {Router} from '../../../core/client_side/site_service/router';


const content = document.querySelector(".js-content");
const heading = document.querySelector(".js-subheader");

for (let key in pugRuntime) {
    window['pug_' + key] = pugRuntime[key];  // TODO get rid of setting to window (temporary solution).
}

export let router = new Router({
    '^/?$': new Index(heading, content, renderIndex.template),

    '^/?index$': new Index(heading, content, renderIndex.template),
    '^/?about$': new About(heading, content, renderAbout.template),
    '^/?choice$': new Choice(heading, content, renderChoice.template),
    '^/?game$': new Game(heading, content, renderGame.template),
    '^/?leaders$': new Leaders(heading, content, renderLeaders.template, {count: 10}),
    '^/?login$': new Login(heading, content, renderLogin.template),
    '^/?signup$': new Signup(heading, content, renderSignup.template),
    '^/?waiting$': new Waiting(heading, content, renderWaiting.template),
}, new Error(heading, content, renderError404.template));
