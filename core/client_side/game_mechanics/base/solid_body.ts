'use strict';

import {CoordinateSystem} from './coordinate_system';
import * as math from './../../../_lib/math';


export class SolidBody extends CoordinateSystem {
    protected _velocity: number[];
    protected _angularVelocity: number;

    constructor(origin: number[] = [0, 0], angle: number = 0, velocity: number[] = [0, 0], angularVelocity: number = 0) {
        super(origin, angle);
        this._velocity = velocity;
        this._angularVelocity = angularVelocity;
    }

    get velocity(): number[] {
        return this._velocity.slice();
    }

    set velocity(velocity: number[]) {
        if (velocity) {
            this._velocity = velocity;
        }
    }

    public getRelativeVelocity(body: SolidBody): number[] {
        return math.subtract(this._velocity, body._velocity);
    }

    get angularVelocity(): number {
        return this._angularVelocity;
    }

    set angularVelocity(_angularVelocity: number) {
        this._angularVelocity = _angularVelocity;
    }
}
