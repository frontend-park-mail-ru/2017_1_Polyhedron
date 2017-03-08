'use strict';

const About = require('./about');
const Game = require('./base');
const Index = require('./game');
const Leaders = require('./leaders');
const Login = require('./login');
const Signup = require('./signup');

(function () {
    window.content = document.querySelector(".content");
    window.subheader = document.querySelector(".subheader");
    window.userpanel = document.querySelector(".top");

    // window.user = {name: 'Player 2', score: '197'};

    let pages = {};
    pages.index = new Index();
    pages.about = new About();
    pages.game = new Game();
    pages.leaders = new Leaders();
    pages.login = new Login();
    pages.signup = new Signup();

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
