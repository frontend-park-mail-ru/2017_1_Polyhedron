'use strict';

import {Component} from '../base';
import * as renderLeaders from '../../templates/render_leaders';

export class LeaderBoard extends Component {
    constructor (options) {
        super(options);
        this.template = renderLeaders.template;
    }
}
