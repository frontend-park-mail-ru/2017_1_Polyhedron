'use strict';

import {About} from './about';
import {Game} from './game';
import {Error} from './error404';
import {Index} from './index';
import {Leaders} from './leaders';
import {Login} from './login';
import {Signup} from './signup';

import * as renderAbout from '../templates/render_about';
import * as renderGame from '../templates/render_game';
import * as renderError404 from '../templates/render_error404';
import * as renderIndex from '../templates/render_index';
import * as renderLeaders from '../templates/render_leaders';
import * as renderLogin from '../templates/render_login';
import * as renderSignup from '../templates/render_signup';
import * as renderTop from '../templates/render_top';
import * as pugRuntime from '../../../node_modules/pug-runtime/index';


const content = document.querySelector(".js-content");
const heading = document.querySelector(".js-subheader");

for (let key in pugRuntime) {
    //console.log(key);
    window['pug_' + key] = pugRuntime[key];  // TODO get rid of setting to window (temporary solution).
}

export let pages = {};
pages.index = new Index(heading, content, renderIndex.template);
pages.about = new About(heading, content, renderAbout.template);
pages.game = new Game(heading, content, renderGame.template);
pages.error = new Error(heading, content, renderError404.template);
pages.leaders = new Leaders(heading, content, renderLeaders.template, {count: 10});
pages.login = new Login(heading, content, renderLogin.template);
pages.signup = new Signup(heading, content, renderSignup.template);
pages.renderTop = renderTop.template;


export function switchPage(page) {
    if (typeof (pages[page]) !== 'undefined') {
        pages[page].render();
    }
    else {
        pages['error'].render();
    }
}

//pages.switchPage = switchPage;

