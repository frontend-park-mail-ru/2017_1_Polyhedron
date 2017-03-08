'use strict';

const About = require('./about');
const Game = require('./base');
const Index = require('./index');
const Leaders = require('./leaders');
const Login = require('./login');
const Signup = require('./signup');

(function () {
    let content = document.querySelector(".content");
    let subheader = document.querySelector(".subheader");

    window.userpanel = document.querySelector(".top");

    // window.user = {name: 'Player 2', score: '197'};

    let pages = {};
    pages.index = new Index(subheader, content);
    pages.about = new About(subheader, content);
    pages.game = new Game(subheader, content);
    pages.leaders = new Leaders(subheader, content);
    pages.login = new Login(subheader, content);
    pages.signup = new Signup(subheader, content);

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
