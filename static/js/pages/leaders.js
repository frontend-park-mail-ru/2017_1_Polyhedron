'use strict';

const BasePage = require('./base');
const BackendAPI = require('../../../core/backend_rest_lib');

class Leaders extends BasePage {
    render() {
        this._heading.innerHTML = "Топ-10";
        let locals = {};

        let backendAPI = new BackendAPI();
        backendAPI.getLeaders(10)
            .then(response => {
                return response.json()
            })
            .then( responseJSON => {
                console.log(responseJSON);
                responseJSON.leaders.forEach(leader => leader.name = leader.login);
                locals.leaders = responseJSON.leaders;
                console.log('Set leaders');
                this._content.innerHTML = this._template(locals);
            });
/*
        locals.leaders = [
            {name: "Player 1", score: 200},
            {name: "Player 2", score: 200},
            {name: "Player 3", score: 200},
        ];
        this._content.innerHTML = this._template(locals);
        */
    }
}

module.exports = Leaders;
