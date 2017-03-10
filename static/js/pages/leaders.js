'use strict';

const BasePage = require('./base');
const BackendAPI = require('../../../core/backend_rest_lib');

class Leaders extends BasePage {
    get_leaders(count) {
        let backendAPI = new BackendAPI();
        backendAPI.getLeaders(count)
            .then((response) => {console.log('Successfully got leaders')})
            .catch((err) => {console.log('Failed to get leaders')});
    }
    render() {
        this._heading.innerHTML = "Топ-10";
        let locals = {};
        let leaders = this.get_leaders(this._options.count);
        console.log(leaders);
        locals.leaders = [
            {login: "Player 1", score: 200},
            {login: "Player 2", score: 200},
            {login: "Player 3", score: 200},
        ];
        this._content.innerHTML = this._template(locals);
    }
}

module.exports = Leaders;
