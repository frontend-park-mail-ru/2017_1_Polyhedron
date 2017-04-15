
import {Scalable} from '../experimental/interfaces';

export class Circle implements Scalable{
    constructor(radius: number) {
        this._radius = radius;
    }

    get radius(): number {
        return this._radius;
    }

    set radius(value: number) {
        this._radius = value;
    }

    rescale(scaleFactor: number) {
        this._radius *= scaleFactor;
    }

    private _radius;
}