'use strict';

import {CoordinateSystem} from '../coordinate_system';
import * as math from '../../../../_lib/math';


export class Line {
    private _startPoint: number[];
    private _endPoint: number[];
    private _coordinateSystem: CoordinateSystem;

    constructor(startPoint, endPoint) {
        this._startPoint = startPoint;
        this._endPoint = endPoint;

        this._coordinateSystem = new CoordinateSystem(this._startPoint, this.angle);
    }

    getClosestPointDistance(globalPoint): number {
        const [localX, localY] = this._coordinateSystem.toLocals(globalPoint);

        if (localX < 0) {
            return math.norm(math.subtract(globalPoint, this._startPoint));
        } else if (localX > this.length) {
            return math.norm(math.subtract(globalPoint, this._endPoint));
        } else {
            return Math.abs(localY);
        }
    }

    getClosestPoint(globalPoint): number[] {
        const localX = this._coordinateSystem.toLocals(globalPoint)[0];

        if (localX < 0) {
            return this._startPoint;
        } else if (localX > this.length) {
            return this._endPoint;
        } else {
            return this._coordinateSystem.toGlobals([localX, 0]);
        }
    }

    getLineDistance(globalPoint): number {
        return Math.abs(this._coordinateSystem.toLocals(globalPoint)[1]);
    }

    _withinLineRange(localPoint): boolean {
        return 0 <= localPoint[0] && localPoint[0] <= this.length;
    }

    get angle(): number {
        return Math.atan2(
            this._endPoint[1] - this._startPoint[1],
            this._endPoint[0] - this._startPoint[0]
        );
    }

    getPositiveNorm(): number {
        return this._coordinateSystem.toGlobalsWithoutOffset([0, 1]);
    }

    getNegativeNorm(): number {
        return this._coordinateSystem.toGlobalsWithoutOffset([0, -1]);
    }

    get length(): number {
        return math.norm(math.subtract(this._endPoint, this._startPoint));
    }
}
