
import {SolidBody} from './solid_body';
import * as math from '../../../_lib/math';


type validatorType = (position: number[]) => boolean;


export abstract class GameComponent extends SolidBody {
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

    public addChild(child: GameComponent) {
        this._children.push(child);
    }

    public moveBy(offset: number[]) {
        this._children.forEach(child => child.moveBy(offset));
        super.moveBy(offset);
    }

    public moveTo(position: number[]) {
        const offset = math.subtract(position, this.position);
        this._children.forEach(child => child.moveBy(offset));
        super.moveTo(position);
    }

    public rotateBy(angularOffset: number, parent?: GameComponent) {
        this._children.forEach(child => child.rotateBy(angularOffset, this));
        super.rotateBy(angularOffset, parent);
    }

    public get scale(): number {
        return this._scale;
    }

    public set scale(scale: number) {
        this._scale = scale;
    }

    public rotateTo(angle: number, parent?: GameComponent) {
        const angularOffset = angle - this.rotation;
        this._children.forEach(child => child.rotateBy(angularOffset, this));
        super.rotateBy(angularOffset, parent);
    }

    public set positionValidator(value: validatorType) {
        this._positionValidator = value;
    }

    public abstract get shape(): any

    public moveToWithConstraints(newPosition: number[]) {
        if (this._positionValidator(newPosition)) {
            this.moveTo(newPosition);
        }
    }

    public moveByWithConstraints(offsetVec: number[], velocityVector: number[] = [0, 0]) {
        if (this._positionValidator(offsetVec)) {
            this.moveBy(offsetVec);
        }

        this.velocity = velocityVector;
    }
}
