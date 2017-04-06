'use strict';

import {BasePage} from './base';
import {Text} from '../components/text/text'
import {LeaderBoard} from '../components/leaderboard/leaderboard'
import {BackendAPI} from '../../../core/client_side/site_service/backend_api';


export class Leaders extends BasePage {
    constructor (heading, content, options) {
        super(heading, content, options);
        this.text = new Text({
            items: [
                {text: 'Список лидеров загружается...'},
            ],
            parent: this._content
        });
    }

    render() {
        this._heading.innerHTML = "Топ-10";
        window.userpanel.render();
        this.text.render();

        let backendAPI = new BackendAPI();
        backendAPI.getLeaders(10)
            .then(response => {
                return response.json();
            })
            .then(responseJSON => {
                this.leaders = new LeaderBoard({
                    items: responseJSON.data,
                    parent: this._content
                }).render();
            });
    }
}
