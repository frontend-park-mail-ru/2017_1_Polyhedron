
import {SolidBody} from './solid_body';
import {Scalable} from '../experimental/interfaces';
import * as math from '../../../_lib/math';


type validatorType = (position: number[]) => boolean;


export abstract class GameComponent extends SolidBody implements Scalable{
    private _positionValidator: validatorType;
    private _children: GameComponent[];
    private _scale: number;

    constructor(
        positionValidator: validatorType = () => true
    ) {
        super();
        this._positionValidator = positionValidator;
        this._children = [];
    }

    addChild(child: GameComponent) {
        this._children.push(child);
    }

    moveBy(offset: number[]) {
        this._children.forEach(child => child.moveBy(offset));
        super.moveBy(offset);
    }

    moveTo(position: number[]) {
        const offset = math.subtract(position, this.position);
        this._children.forEach(child => child.moveBy(offset));
        super.moveTo(position);
    }

    rotateBy(angularOffset: number, parent?: GameComponent) {
        this._children.forEach(child => child.rotateBy(angularOffset, this));
        super.rotateBy(angularOffset, parent);
    }

    get scale(): number {
        return this._scale;
    }

    set scale(scale: number) {
        this._scale = scale;
    }

    rotateTo(angle: number, parent?: GameComponent) {
        const angularOffset = angle - this.rotation;
        this._children.forEach(child => child.rotateBy(angularOffset, this));
        super.rotateBy(angularOffset, parent);
    }

    set positionValidator(value: validatorType) {
        this._positionValidator = value;
    }

    abstract get shape(): any

    rescale(scaleFactor: number) {
        this.shape.rescale(scaleFactor);
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
