'use strict';

const About = require('./about');
const Game = require('./base');
const Index = require('./game');
const Leaders = require('./leaders');
const Login = require('./login');
const Signup = require('./signup');


const render_about = require('./templates/render_about');
const render_game = require('./templates/render_game');
const render_index = require('./templates/render_index');
const render_leaders = require('./templates/render_leaders');
const render_signup = require('./templates/render_signup');
window.render_top = require('./templates/render_top');
const render_login = require('./templates/render_login');


(function () {
    window.content = document.querySelector(".content");
    window.subheader = document.querySelector(".subheader");
    window.userpanel = document.querySelector(".top");

    // window.user = {name: 'Player 2', score: '197'};

    let pages = {};
    pages.index = new Index(render_index);
    pages.about = new About(render_about);
    pages.game = new Game(render_game);
    pages.leaders = new Leaders(render_leaders);
    pages.login = new Login(render_login);
    pages.signup = new Signup(render_signup);

    window.userpanel.innerHTML = window.render_top();

    pages.index.render();


    function switch_page(page) {
        if (typeof (pages[page]) != 'undefined') {
            pages[page].render();
        }
    }

    document.body.addEventListener('click', event => {
        let target = event.target;
        if (target.nodeName == "A") {
            event.preventDefault();
            switch_page(target.dataset.page);
        }
    });

})();
