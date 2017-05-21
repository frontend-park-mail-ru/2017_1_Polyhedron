'use strict';

import {Component} from '../base';
import * as renderTop from '../../templates/render_top';
import {Waiter} from '../waiter/waiter';
import {Autowired} from "../../../../core/client_side/game_mechanics/experimental/decorators";
import {BackendAPI} from "../../../../core/client_side/site_service/backend_api";
import {VariableContext} from "../../../../core/client_side/game_mechanics/experimental/context";

export class Top extends Component {
    @Autowired(BackendAPI)
    private backendAPI: BackendAPI;

    @Autowired(VariableContext)
    private variableMap: VariableContext;

    private hideMenu: boolean;
    private hideLogin: boolean;
    private hideReg: boolean;

    constructor(options = {}) {
        super(options);
        this.template = renderTop.template;
        this.hideMenu = false;
        this.hideReg = false;
        this.hideLogin = false;
    }

    public set_options(hideMenu, hideLogin, hideReg) {
        this.hideMenu = hideMenu;
        this.hideLogin = hideLogin;
        this.hideReg = hideReg;
    }

    public render() {
        const userpanel = document.querySelector(".js-top");
        userpanel.innerHTML = '';
        const waiter = new Waiter({parent: userpanel});
        waiter.render();

        this.backendAPI.getuser()
            .then(response => {
                return response.json();
            })
            .then(responseJSON => {
                this.variableMap.set('user', responseJSON.data);

                userpanel.innerHTML = renderTop.template({
                    user: responseJSON.data,
                    hide_menu: this.hideMenu,
                    hide_login: this.hideLogin,
                    hide_reg: this.hideReg
                });
            });
        return this;
    }

    public login() {
        const userpanel = document.querySelector(".js-top");
        userpanel.innerHTML = '';
        const waiter = new Waiter({parent: userpanel});
        waiter.render();
        this.backendAPI.getuser()
            .then(response => {
                return response.json();
            })
            .then(responseJSON => {
                this.variableMap.set('user', responseJSON.data);

                userpanel.innerHTML = renderTop.template();
            });
    }

    public logout() {
        this.variableMap.set('user', null);

        this.render();
        this.backendAPI.logout();
    }
}
