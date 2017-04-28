'use strict';

import {Component} from '../base';
import * as renderMenu from '../../templates/render_menu';

export class Menu extends Component {
    constructor(options) {
        super(options);
        this.template = renderMenu.template;
    }
}
