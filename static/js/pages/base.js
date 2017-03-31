
import * as renderTop from '../templates/render_top';
import {BackendAPI} from '../../../core/client_side/site_service/backend_api';

export class BasePage {
    constructor (heading, container, template, options) {
        this._heading = heading;
        this._content = container;
        this._options = options;
        this._template = template;
    }

    renderTop() {       // TODO Remove (method added cos component approach is not realized yet)
        let backendAPI = new BackendAPI();
        backendAPI.getuser()
            .then(response => {
                return response.json();
            })
            .then(responseJSON => {
                window.user = responseJSON.data;
                const userpanel = document.querySelector(".js-top");
                userpanel.innerHTML = renderTop.template();
                renderTop.template();
            });
    }

    render() {
        //override this method
    }
}
