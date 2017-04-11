"use strict";
class Circle {
    constructor(radius) {
        this._radius = radius;
    }
    get radius() {
        return this._radius;
    }
    set radius(value) {
        this._radius = value;
    }
    scale(scaleFactor) {
        this._radius *= scaleFactor;
    }
}
exports.Circle = Circle;
//# sourceMappingURL=circle.js.map