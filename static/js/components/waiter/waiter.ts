'use strict';

import {Component} from '../base';
import * as renderWaiter from '../../templates/render_waiter';

export class Waiter extends Component {
    constructor(options) {
        super(options);
        this.template = renderWaiter.template;
    }

    public render() {
        this.parent.innerHTML = this.parent.innerHTML + this.template({items: this.items, attrs: this.attrs});
        return this;
    }
}
