
import {SolidBody} from './solid_body';
import {Scalable} from '../experimental/interfaces';
import * as math from '../../../_lib/math';


type validatorType = (position: number[]) => boolean;


export abstract class GameComponent extends SolidBody implements Scalable{

    private _anchor: number[];
    private _positionValidator: validatorType;
    private _children: GameComponent[];
    static config;

    constructor(
        anchor: number[] = [0, 0],
        positionValidator: validatorType = () => true
    ) {
        super();

        this._anchor = anchor;
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

    rotateTo(angle: number, parent?: GameComponent) {
        const angularOffset = angle - this.rotation;
        this._children.forEach(child => child.rotateBy(angularOffset, this));
        super.rotateBy(angularOffset, parent);
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

    abstract get shape(): any

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
