'use strict';

const About = require('./about');
const Game = require('./game');
const Error = require('./error404');
const Index = require('./index');
const Leaders = require('./leaders');
const Login = require('./login');
const Signup = require('./signup');

const renderAbout = require('../templates/render_about');
const renderGame = require('../templates/render_game');
const renderError404 = require('../templates/render_error404');
const renderIndex = require('../templates/render_index');
const renderLeaders = require('../templates/render_leaders');
const renderLogin = require('../templates/render_login');
const renderSignup = require('../templates/render_signup');
const renderTop = require('../templates/render_top');
const pugRuntime = require('../../../node_modules/pug-runtime/index');

const content = document.querySelector(".js-content");
const heading = document.querySelector(".js-subheader");

for (let key in pugRuntime) {
    //console.log(key);
    window['pug_' + key] = pugRuntime[key];  // TODO get rid of setting to window (temporary solution).
}

let pages = {};
pages.index = new Index(heading, content, renderIndex);
pages.about = new About(heading, content, renderAbout);
pages.game = new Game(heading, content, renderGame);
pages.error = new Error(heading, content, renderError404);
pages.leaders = new Leaders(heading, content, renderLeaders);
pages.login = new Login(heading, content, renderLogin);
pages.signup = new Signup(heading, content, renderSignup);
pages.render_top = renderTop;


function switchPage(page) {
    if (typeof (pages[page]) !== 'undefined') {
        pages[page].render();
    }
    else {
        pages['error'].render();
    }
}

pages.switch_page = switchPage;

module.exports = pages;