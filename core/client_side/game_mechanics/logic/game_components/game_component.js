
import {SolidBody} from '../solid_body';


export class GameComponent extends SolidBody {
    constructor(anchor, positionValidator) {
        super();

        this._anchor = anchor || [0, 0];
        this._positionValidator = positionValidator;
        if (!this._positionValidator) {
            this._positionValidator = () => true;
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
        this._positionValidator = value;
    }

    get shape() {
        throw Error("Override this method");
    }

    scale(scaleFactor) {
        this.shape.scale(scaleFactor);
    }

    moveToWithConstraints(newPosition) {
        if (this._positionValidator(newPosition)) {
            this.moveTo(newPosition);
        }
    }

    moveByWithConstraints(offsetVec) {
        if (this._positionValidator(offsetVec)) {
            this.moveBy(offsetVec);
        }
    }


}
