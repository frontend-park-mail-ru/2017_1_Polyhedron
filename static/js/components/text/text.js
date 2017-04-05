'use strict';

import {Component} from '../base';
import * as renderText from '../../templates/render_text';

export class Text extends Component {
    constructor (options) {
        super(options);
        this.template = renderText.template;
    }
}
