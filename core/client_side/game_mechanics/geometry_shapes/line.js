'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var coordinate_system_1 = require("../base/coordinate_system");
var math = require("../../../_lib/math");
var Line = (function () {
    function Line(startPoint, endPoint) {
        this._startPoint = startPoint;
        this._endPoint = endPoint;
        this._coordinateSystem = new coordinate_system_1.CoordinateSystem(this._startPoint, this.angle);
    }
    Line.prototype.getClosestPointDistance = function (globalPoint) {
        var _a = this._coordinateSystem.toLocals(globalPoint), localX = _a[0], localY = _a[1];
        if (localX < 0) {
            return math.norm(math.subtract(globalPoint, this._startPoint));
        }
        else if (localX > this.length) {
            return math.norm(math.subtract(globalPoint, this._endPoint));
        }
        else {
            return Math.abs(localY);
        }
    };
    Line.prototype.getClosestPoint = function (globalPoint) {
        var localX = this._coordinateSystem.toLocals(globalPoint)[0];
        if (localX < 0) {
            return this._startPoint;
        }
        else if (localX > this.length) {
            return this._endPoint;
        }
        else {
            return this._coordinateSystem.toGlobals([localX, 0]);
        }
    };
    Line.prototype.getLineDistance = function (globalPoint) {
        return Math.abs(this._coordinateSystem.toLocals(globalPoint)[1]);
    };
    Line.prototype._withinLineRange = function (localPoint) {
        return 0 <= localPoint[0] && localPoint[0] <= this.length;
    };
    Object.defineProperty(Line.prototype, "angle", {
        get: function () {
            return Math.atan2(this._endPoint[1] - this._startPoint[1], this._endPoint[0] - this._startPoint[0]);
        },
        enumerable: true,
        configurable: true
    });
    Line.prototype.getPositiveNorm = function () {
        return this._coordinateSystem.toGlobalsWithoutOffset([0, 1]);
    };
    Line.prototype.getNegativeNorm = function () {
        return this._coordinateSystem.toGlobalsWithoutOffset([0, -1]);
    };
    Object.defineProperty(Line.prototype, "length", {
        get: function () {
            return math.norm(math.subtract(this._endPoint, this._startPoint));
        },
        enumerable: true,
        configurable: true
    });
    return Line;
}());
exports.Line = Line;
//# sourceMappingURL=line.js.map