"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Triangle = (function () {
    function Triangle(height, sectorAngle) {
        this._height = height;
        this._sectorAngle = sectorAngle;
        this._halfWidth = height * Math.tan(sectorAngle / 2);
    }
    Object.defineProperty(Triangle.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Triangle.prototype, "halfWidth", {
        get: function () {
            return this._halfWidth;
        },
        enumerable: true,
        configurable: true
    });
    Triangle.prototype.getPointArray = function () {
        return [
            [0, 0],
            [-this._height * Math.tan(this._sectorAngle / 2), -this._height],
            [this._height * Math.tan(this._sectorAngle / 2), -this._height],
        ];
    };
    Triangle.prototype.contains = function (point) {
        var _this = this;
        var f1 = function (x, y) { return y < _this.height + x * _this.height / _this.halfWidth; };
        var f2 = function (x, y) { return y < _this.height - x * _this.height / _this.halfWidth; };
        var f3 = function (x) { return -_this.halfWidth < x && x < _this.halfWidth; };
        var pointX = point[0];
        var pointY = point[1] + this.height; // move coordinate system origin to the base center
        return pointY > 0 && f1(pointX, pointY) && f2(pointX, pointY) && f3(pointX);
    };
    Triangle.prototype.getBottomDistance = function (point) {
        return point[1] + this._height;
    };
    /**
     *
     * @param bottomDistance
     * @returns number (width of the triangle on the specified distance from bottom)
     */
    Triangle.prototype.getWidthOnDistance = function (bottomDistance) {
        return 2 * (1 - bottomDistance / this._height) * this._halfWidth;
    };
    Triangle.prototype.scale = function (scaleFactor) {
        this._height *= scaleFactor;
        this._halfWidth *= scaleFactor;
    };
    return Triangle;
}());
exports.Triangle = Triangle;
//# sourceMappingURL=triangle.js.map