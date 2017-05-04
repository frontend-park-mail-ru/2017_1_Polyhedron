'use strict';

export class Circle {
    private _radius;

    constructor(radius: number) {
        this._radius = radius;
    }

    public get radius(): number {
        return this._radius;
    }

    public set radius(value: number) {
        this._radius = value;
    }
}
