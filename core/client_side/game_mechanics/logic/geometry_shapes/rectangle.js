"use strict";


export class Rectangle {
    constructor(width, height) {
        this._height = height;
        this._width = width;
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
    }

    /*
    Coordinate system origin is in the rectangle center
     */
    contains([x, y]) {
        return -this._width / 2 <= x && x<= this._width / 2 &&
                -this._height / 2 <= y && y <= this._height / 2;
    }

    getPointArray() {
        return [
            [-this._width / 2, -this._height / 2],
            [this._width / 2, -this._height / 2],
            [this._width / 2, this._height / 2],
            [-this._width / 2, this._height / 2]
        ];
    }

    scale(scaleFactor) {
        this._width *= scaleFactor;
        this._height *= scaleFactor;
    }
}


