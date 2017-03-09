'use strict';

const About = require('./about');
const Game = require('./game');
const Error = require('./error404');
const Index = require('./index');
const Leaders = require('./leaders');
const Login = require('./login');
const Signup = require('./signup');

const render_about = require('../templates/render_about');
const render_game = require('../templates/render_game');
const render_error404 = require('../templates/render_error404');
const render_index = require('../templates/render_index');
const render_leaders = require('../templates/render_leaders');
const render_login = require('../templates/render_login');
const render_signup = require('../templates/render_signup');
const render_top = require('../templates/render_top');
const pugRuntime = require('../../../node_modules/pug-runtime/index');

const content = document.querySelector(".js-content");
const heading = document.querySelector(".js-subheader");

for (let key in pugRuntime) {
    //console.log(key);
    window['pug_' + key] = pugRuntime[key];  // TODO get rid of setting to window (temporary solution).
}

let pages = {};
pages.index = new Index(heading, content, render_index);
pages.about = new About(heading, content, render_about);
pages.game = new Game(heading, content, render_game);
pages.error = new Error(heading, content, render_error404);
pages.leaders = new Leaders(heading, content, render_leaders);
pages.login = new Login(heading, content, render_login);
pages.signup = new Signup(heading, content, render_signup);
pages.render_top = render_top;


function switch_page(page) {
    if (typeof (pages[page]) !== 'undefined') {
        pages[page].render();
    }
    else {
        pages['error'].render();
    }
}

pages.switch_page = switch_page;

module.exports = pages;