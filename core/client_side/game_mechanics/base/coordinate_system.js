'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var math = require("./../../../_lib/math");
var CoordinateSystem = (function () {
    function CoordinateSystem(origin, angle) {
        this._origin = origin;
        this._angle = angle;
    }
    CoordinateSystem.prototype.moveBy = function (offset) {
        this._origin = math.add(this._origin, offset);
    };
    CoordinateSystem.prototype.moveTo = function (position) {
        this._origin = position;
    };
    CoordinateSystem.prototype.rotateBy = function (angularOffset) {
        this._angle += angularOffset;
    };
    CoordinateSystem.prototype.rotateTo = function (angle) {
        this._angle = angle;
    };
    Object.defineProperty(CoordinateSystem.prototype, "position", {
        get: function () {
            return this._origin.slice();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoordinateSystem.prototype, "rotation", {
        get: function () {
            return this._angle;
        },
        enumerable: true,
        configurable: true
    });
    CoordinateSystem.prototype.toLocalsWithoutOffset = function (globalPoint) {
        return math.multiply(this._getRotationMatrix(), globalPoint).toArray();
    };
    CoordinateSystem.prototype.toGlobalsWithoutOffset = function (localPoint) {
        return math.multiply(this._getInverseRotationMatrix(), localPoint).toArray();
    };
    CoordinateSystem.prototype.toLocals = function (globalCoord) {
        return math.multiply(this._getRotationMatrix(), math.subtract(globalCoord, this._origin)).toArray();
    };
    CoordinateSystem.prototype.toGlobals = function (localCoord) {
        return math.add(math.multiply(this._getInverseRotationMatrix(), localCoord), this._origin).toArray();
    };
    CoordinateSystem.prototype._getRotationMatrix = function () {
        return math.matrix([
            [Math.cos(this._angle), Math.sin(this._angle)],
            [-Math.sin(this._angle), Math.cos(this._angle)]
        ]);
    };
    CoordinateSystem.prototype._getInverseRotationMatrix = function () {
        return math.matrix([
            [Math.cos(this._angle), -Math.sin(this._angle)],
            [Math.sin(this._angle), Math.cos(this._angle)]
        ]);
    };
    return CoordinateSystem;
}());
exports.CoordinateSystem = CoordinateSystem;
//# sourceMappingURL=coordinate_system.js.map