"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Circle = (function () {
    function Circle(radius) {
        this._radius = radius;
    }
    Object.defineProperty(Circle.prototype, "radius", {
        get: function () {
            return this._radius;
        },
        set: function (value) {
            this._radius = value;
        },
        enumerable: true,
        configurable: true
    });
    Circle.prototype.scale = function (scaleFactor) {
        this._radius *= scaleFactor;
    };
    return Circle;
}());
exports.Circle = Circle;
//# sourceMappingURL=circle.js.map