'use strict';

import * as math from './../../../_lib/math';


export class CoordinateSystem {
    constructor(origin, angle) {
        this._origin = origin;
        this._angle = angle;
    }

    moveBy(offset) {
        this._origin = math.add(this._origin, offset);
    }

    moveTo(position) {
        this._origin = position;
    }

    rotateBy(angularOffset) {
        this._angle += angularOffset;
    }

    rotateTo(angle) {
        this._angle = angle;
    }

    get position() {
        return this._origin.slice();
    }

    get rotation() {
        return this._angle;
    }

    toLocalsWithoutOffset(globalPoint) {
        return math.multiply(this._getRotationMatrix(this._angle), globalPoint).toArray();
    }

    toGlobalsWithoutOffset(localPoint,) {
        return math.multiply(this._getInverseRotationMatrix(this._angle), localPoint).toArray();
    }

    toLocals(globalCoord) {
        return math.multiply(this._getRotationMatrix(), math.subtract(globalCoord, this._origin)).toArray();
    }

    toGlobals(localCoord) {
        return math.add(math.multiply(this._getInverseRotationMatrix(), localCoord), this._origin).toArray();
    }

    _getRotationMatrix() {
        return math.matrix([
            [Math.cos(this._angle), Math.sin(this._angle)],
            [-Math.sin(this._angle), Math.cos(this._angle)]
        ]);
    }

    _getInverseRotationMatrix() {
        return math.matrix([
            [Math.cos(this._angle), -Math.sin(this._angle)],
            [Math.sin(this._angle), Math.cos(this._angle)]
        ]);
    }
}

