"use strict";


export class Rectangle {
    private _height: number;
    private _width: number;

    constructor(width, height) {
        this._height = height;
        this._width = width;
    }

    public get height(): number {
        return this._height;
    }

    public set height(value) {
        this._height = value;
    }

    public get width(): number {
        return this._width;
    }

    public set width(value) {
        this._width = value;
    }

    /*
    Coordinate system origin is in the rectangle center
     */
    public contains([x, y]): boolean {
        return -this._width / 2 <= x && x <= this._width / 2 &&
                -this._height / 2 <= y && y <= this._height / 2;
    }

    public getPointArray(): number[][] {
        return [
            [-this._width / 2, -this._height / 2],
            [this._width / 2, -this._height / 2],
            [this._width / 2, this._height / 2],
            [-this._width / 2, this._height / 2]
        ];
    }
}
