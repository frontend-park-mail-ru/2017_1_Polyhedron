'use strict';

import {BasePage} from './base';
import {BackendAPI} from '../../../core/client_side/site_service/backend_api';

export class Leaders extends BasePage {
    render() {
        this._heading.innerHTML = "Топ-10";
        let locals = {};

        let backendAPI = new BackendAPI();
        backendAPI.getLeaders(10)
            .then(response => {
                return response.json();
            })
            .then( responseJSON => {
                console.log(responseJSON);
                locals.leaders = responseJSON.leaders;
                this._content.innerHTML = this._template(locals);
            });
    }
}
