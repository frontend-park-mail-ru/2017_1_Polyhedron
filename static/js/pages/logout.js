
import {BasePage} from './base';

export class Logout extends BasePage {
    render () {
        window.backendAPI.logout();
        window.userpanel.render();
    }
}
