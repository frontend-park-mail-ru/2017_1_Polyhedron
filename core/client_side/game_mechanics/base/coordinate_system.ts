'use strict';

import * as math from './../../../_lib/math';


export class CoordinateSystem {
    private _origin: number[];
    private _angle: number;

    constructor(origin: number[], angle: number) {
        this._origin = origin;
        this._angle = angle;
    }

    moveBy(offset: number[]) {
        this._origin = math.add(this._origin, offset);
    }

    moveTo(position: number[]) {
        this._origin = position;
    }

    rotateBy(angularOffset: number) {
        this._angle += angularOffset;
    }

    rotateTo(angle: number) {
        this._angle = angle;
    }

    get position(): number[] {
        return this._origin.slice();
    }

    get rotation(): number {
        return this._angle;
    }

    toLocalsWithoutOffset(globalPoint: number[]) {
        return math.multiply(this._getRotationMatrix(), globalPoint).toArray();
    }

    toGlobalsWithoutOffset(localPoint: number[]) {
        return math.multiply(this._getInverseRotationMatrix(), localPoint).toArray();
    }

    toLocals(globalCoord: number[]) {
        return math.multiply(this._getRotationMatrix(), math.subtract(globalCoord, this._origin)).toArray();
    }

    toGlobals(localCoord: number[]) {
        return math.add(math.multiply(this._getInverseRotationMatrix(), localCoord), this._origin).toArray();
    }

    _getRotationMatrix(): number[][] {
        return math.matrix([
            [Math.cos(this._angle), Math.sin(this._angle)],
            [-Math.sin(this._angle), Math.cos(this._angle)]
        ]);
    }

    _getInverseRotationMatrix(): number[][] {
        return math.matrix([
            [Math.cos(this._angle), -Math.sin(this._angle)],
            [Math.sin(this._angle), Math.cos(this._angle)]
        ]);
    }
}

