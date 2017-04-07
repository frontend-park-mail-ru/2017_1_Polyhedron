'use strict';

import {Component} from '../base';
import {BackendAPI} from '../../../../core/client_side/site_service/backend_api';
import * as renderTop from '../../templates/render_top';

export class Top extends Component {
    constructor (options = {}) {
        super(options);
        this.template = renderTop.template;
    }

    render () {
        window.backendAPI.getuser()
            .then(response => {
                return response.json();
            })
            .then(responseJSON => {
                window.user = responseJSON.data;
                const userpanel = document.querySelector(".js-top");
                userpanel.innerHTML = renderTop.template();
            });
        return this;
    }

    login () {
        window.backendAPI.getuser()
            .then(response => {
                return response.json();
            })
            .then(responseJSON => {
                window.user = responseJSON.data;
                const userpanel = document.querySelector(".js-top");
                userpanel.innerHTML = renderTop.template();
            });
    }

    logout () {
        window.user = null;
        window.backendAPI.logout();
    }
}
