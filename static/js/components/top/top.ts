'use strict';

import {Component} from '../base';
import * as renderTop from '../../templates/render_top';
import {Autowired} from "../../../../core/client_side/game_mechanics/experimental/decorators";
import {BackendAPI} from "../../../../core/client_side/site_service/backend_api";
import {VariableContext} from "../../../../core/client_side/game_mechanics/experimental/context";

export class Top extends Component {
    @Autowired(BackendAPI)
    private backendAPI: BackendAPI;

    @Autowired(VariableContext)
    private variableMap: VariableContext;

    constructor(options = {}) {
        super(options);
        this.template = renderTop.template;
    }

    public render() {
        this.backendAPI.getuser()
            .then(response => {
                return response.json();
            })
            .then(responseJSON => {
                this.variableMap.set('user', responseJSON.data);
                const userpanel = document.querySelector(".js-top");
                userpanel.innerHTML = renderTop.template({
                    user: responseJSON.data
                });
            })
            .catch(() => {
                this.variableMap.set('user', null);
                const userpanel = document.querySelector(".js-top");
                userpanel.innerHTML = renderTop.template({
                    user: null
                });
            });
        return this;
    }

    public login() {
        this.backendAPI.getuser()
            .then(response => {
                return response.json();
            })
            .then(responseJSON => {
                this.variableMap.set('user', responseJSON.data);

                const userpanel = document.querySelector(".js-top");
                userpanel.innerHTML = renderTop.template();
            });
    }

    public logout() {
        this.variableMap.set('user', null);

        this.render();
        this.backendAPI.logout();
    }
}
