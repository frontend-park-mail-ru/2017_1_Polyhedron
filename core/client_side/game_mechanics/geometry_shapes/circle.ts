
import {Scalable} from '../experimental/interfaces';

export class Circle implements Scalable {
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

    public rescale(scaleFactor: number) {
        this._radius *= scaleFactor;
    }
}
