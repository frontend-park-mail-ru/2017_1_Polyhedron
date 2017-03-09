'use strict';

const BasePage = require('./base');

class Leaders extends BasePage {
    render() {
        this._heading.innerHTML = "Топ-10";
        //let locals = {};
        window.leaders = [
            {name: "Player 1", score: 200},
            {name: "Player 2", score: 200},
            {name: "Player 3", score: 200},
        ];
        //locals.user = window.user;
        this._content.innerHTML = this._template();
    };
}

module.exports = Leaders;
