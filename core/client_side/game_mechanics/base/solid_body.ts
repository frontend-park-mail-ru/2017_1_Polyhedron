'use strict';

import {CoordinateSystem} from './coordinate_system';


export class SolidBody extends CoordinateSystem {
    private _velocity: number[];
    private _angularVelocity: number;

    constructor(origin: number[] = [0, 0], angle: number = 0, velocity: number[] = [0, 0], angularVelocity: number = 0) {
        super(origin, angle);
        this._velocity = velocity || [0, 0];
        this._angularVelocity = angularVelocity || 0;
    }

    get velocity(): number[] {
        return this._velocity.slice();
    }

    set velocity(velocity: number[]) {
        if (velocity) {
            this._velocity = velocity;
        }
    }

    get angularVelocity(): number {
        return this._angularVelocity;
    }

    set angularVelocity(_angularVelocity: number) {
        this._angularVelocity = _angularVelocity;
    }
}
