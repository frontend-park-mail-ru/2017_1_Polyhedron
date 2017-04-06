
import {SolidBody} from '../solid_body';


export class GameComponent extends SolidBody {
    constructor(anchor, positionValidator) {
        super();

        this._anchor = anchor || [0, 0];
        this._positionValidator = positionValidator;
        if (!this._positionValidator) {
            this._positionValidator = (x, y) => true;
        }
    }

    get anchor() {
        return this._anchor;
    }

    set anchor(value) {
        this._anchor = value;
    }

    get positionValidator() {
        return this._positionValidator;
    }

    set positionValidator(value) {
        //this._positionValidator = ([x, y]) => offsetValidator([x - this._anchor[0], y - this._anchor[1]]);
        this._positionValidator = value;
        //this._positionValidator = ([x, y]) => offsetValidator([x - this.anchor[0], y - this.anchor[1]]);
    }

}