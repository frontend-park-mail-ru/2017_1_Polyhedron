'use strict';

import {CoordinateSystem} from '../coordinate_system';
import * as math from '../../../../_lib/math';


export class Line {
    constructor(startPoint, endPoint) {
        this._startPoint = startPoint;
        this._endPoint = endPoint;

        this._coordinateSystem = new CoordinateSystem(this._startPoint, this.angle);
    }

    getClosestPointDistance(globalPoint) {
        const [localX, localY] = this._coordinateSystem.toLocals(globalPoint);

        if (localX < 0) {
            return math.norm(math.subtract(globalPoint, this._startPoint));
        } else if (localX > this.length) {
            return math.norm(math.subtract(globalPoint, this._endPoint));
        } else {
            return Math.abs(localY);
        }
    }

    getLineDistance(globalPoint) {
        return Math.abs(this._coordinateSystem.toLocals(globalPoint)[1]);
    }

    _withinLineRange(localPoint) {
        return 0 <= localPoint[0] && localPoint[0] <= this.length;
    }

    get angle() {
        return Math.atan2(
            this._endPoint[1] - this._startPoint[1],
            this._endPoint[0] - this._startPoint[0]
        );
    }

    getPositiveNorm() {
        return this._coordinateSystem.toGlobalsWithoutOffset([0, 1]);
    }

    getNegativeNorm() {
        return this._coordinateSystem.toGlobalsWithoutOffset([0, -1]);
    }

    get length() {
        return math.norm(math.subtract(this._endPoint, this._startPoint));
    }
}
