'use strict';

import * as math from './../../../_lib/math';
import * as geometry from './geometry';


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

    rotateBy(angularOffset: number, origin?: CoordinateSystem) {
        this._angle += angularOffset;
        if (origin) {
            this._origin = geometry.rotate(this._origin, angularOffset, origin.position);
        }
    }

    rotateTo(angle: number, origin?: CoordinateSystem) {
        const angularOffset = angle - this._angle;
        this._angle = angle;

        if (origin) {
            this._origin = geometry.rotate(this._origin, angularOffset, origin.position);
        }
    }

    get position(): number[] {
        return this._origin.slice();
    }

    get rotation(): number {
        return this._angle;
    }

    toLocalsWithoutOffset(globalPoint: number[]): number[] {
        return math.multiply(geometry.getRotationMatrix(this._angle), globalPoint).toArray();
    }

    toGlobalsWithoutOffset(localPoint: number[]): number[] {
        return math.multiply(geometry.getInverseRotationMatrix(this._angle), localPoint).toArray();
    }

    toLocals(globalCoord: number[]): number[] {
        return math.multiply(geometry.getRotationMatrix(this._angle), math.subtract(globalCoord, this._origin)).toArray();
    }

    toGlobals(localCoord: number[]): number[] {
        return math.add(math.multiply(geometry.getInverseRotationMatrix(this._angle), localCoord), this._origin).toArray();
    }
}

