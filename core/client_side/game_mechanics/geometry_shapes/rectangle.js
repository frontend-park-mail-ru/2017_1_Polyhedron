"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rectangle = (function () {
    function Rectangle(width, height) {
        this._height = height;
        this._width = width;
    }
    Object.defineProperty(Rectangle.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (value) {
            this._height = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (value) {
            this._width = value;
        },
        enumerable: true,
        configurable: true
    });
    /*
    Coordinate system origin is in the rectangle center
     */
    Rectangle.prototype.contains = function (_a) {
        var x = _a[0], y = _a[1];
        return -this._width / 2 <= x && x <= this._width / 2 &&
            -this._height / 2 <= y && y <= this._height / 2;
    };
    Rectangle.prototype.getPointArray = function () {
        return [
            [-this._width / 2, -this._height / 2],
            [this._width / 2, -this._height / 2],
            [this._width / 2, this._height / 2],
            [-this._width / 2, this._height / 2]
        ];
    };
    Rectangle.prototype.scale = function (scaleFactor) {
        this._width *= scaleFactor;
        this._height *= scaleFactor;
    };
    return Rectangle;
}());
exports.Rectangle = Rectangle;
//# sourceMappingURL=rectangle.js.map