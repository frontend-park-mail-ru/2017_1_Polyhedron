'use strict';

const About = require('./about');
const Game = require('./game');
const Index = require('./index');
const Leaders = require('./leaders');
const Login = require('./login');
const Signup = require('./signup');


const render_about = require('./templates/render_about');
const render_game = require('./templates/render_game');
const render_index = require('./templates/render_index');
const render_leaders = require('./templates/render_leaders');
const render_login = require('./templates/render_login');
const render_signup = require('./templates/render_signup');
const render_top = require('./templates/render_top');


(function () {
    const content = document.querySelector(".content");
    const heading = document.querySelector(".subheader");
    const userpanel = document.querySelector(".top");

    //window.user = {name: 'Player 2', score: '197'};

    let pages = {};
    pages.index = new Index(heading, content, render_index);
    pages.about = new About(heading, content, render_about);
    pages.game = new Game(heading, content, render_game);
    pages.leaders = new Leaders(heading, content, render_leaders);
    pages.login = new Login(heading, content, render_login);
    pages.signup = new Signup(heading, content, render_signup);

    userpanel.innerHTML = render_top();

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
