'use strict';

import * as math from './../../../_lib/math';
import {CoordinateSystem} from './coordinate_system';



export class SolidBody extends CoordinateSystem {
    constructor(origin, angle, velocity, angularVelocity) {
        super(origin, angle);
        this._origin = origin ? math.matrix(origin) : math.matrix([0, 0]);
        this._angle = angle || 0;
        this._velocity = velocity || [0, 0];
        this._angularVelocity = angularVelocity || 0;
    }

    get velocity() {
        return this._velocity.slice();
    }

    set velocity(velocity) {
        if (velocity) {
            this._velocity = velocity;
        }
    }

    get angularVelocity() {
        return this._angularVelocity;
    }

    set angularVelocity(_angularVelocity) {
        this._angularVelocity = _angularVelocity;
    }
}
