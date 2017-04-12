
import {SolidBody} from './solid_body';
import {Scalable} from '../experimental/interfaces'


type validatorType = (position: number[]) => true;

export class GameComponent extends SolidBody implements Scalable{

    private _anchor: number[];
    private _positionValidator: validatorType;

    constructor(
        anchor: number[] = [0, 0],
        positionValidator: validatorType = () => true
    ) {
        super();

        this._anchor = anchor;
        this._positionValidator = positionValidator;
    }

    get anchor(): number[] {
        return this._anchor;
    }

    set anchor(value: number[]) {
        this._anchor = value;
    }

    get positionValidator(): validatorType {
        return this._positionValidator;
    }

    set positionValidator(value: validatorType) {
        this._positionValidator = value;
    }

    get shape(): any {
        throw Error("Override this method");
    }

    scale(scaleFactor: number) {
        this.shape.scale(scaleFactor);
    }

    moveToWithConstraints(newPosition: number[]) {
        if (this._positionValidator(newPosition)) {
            this.moveTo(newPosition);
        }
    }

    moveByWithConstraints(offsetVec: number[], velocityVector?: number[]) {
        if (this._positionValidator(offsetVec)) {
            this.moveBy(offsetVec);
            this.velocity = velocityVector;
        } else {
            this.velocity = [0, 0];
        }
    }


}
