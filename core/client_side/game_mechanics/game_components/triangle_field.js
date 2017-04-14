'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var triangle_1 = require("../geometry_shapes/triangle");
var game_component_1 = require("../base/game_component");
var id_generator_1 = require("../common/id_generator");
var TriangleField = (function (_super) {
    __extends(TriangleField, _super);
    function TriangleField(height, sectorAngle, isNeutral) {
        var _this = _super.call(this) || this;
        _this._triangle = new triangle_1.Triangle(height, sectorAngle);
        _this._isNeutral = isNeutral;
        _this._isLoser = false;
        _this._id = TriangleField.idGenerator();
        return _this;
    }
    TriangleField.prototype.contains = function (point) {
        return this._triangle.contains(this.toLocals(point));
    };
    Object.defineProperty(TriangleField.prototype, "height", {
        get: function () {
            return this._triangle.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleField.prototype, "halfWidth", {
        get: function () {
            return this._triangle.halfWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleField.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleField.prototype, "shape", {
        get: function () {
            return this._triangle;
        },
        enumerable: true,
        configurable: true
    });
    TriangleField.prototype.getPointArray = function () {
        var _this = this;
        return this._triangle.getPointArray().map(function (point) { return _this.toGlobals(point); });
    };
    TriangleField.prototype.getBottomNorm = function () {
        return this.toGlobalsWithoutOffset([0, 1]);
    };
    TriangleField.prototype.isNeutral = function () {
        return this._isNeutral;
    };
    TriangleField.prototype.isLoser = function () {
        return this._isLoser;
    };
    TriangleField.prototype.setLoser = function (isLoser) {
        if (isLoser === void 0) { isLoser = true; }
        this._isLoser = isLoser;
    };
    TriangleField.prototype.containsGlobalPoint = function (point) {
        return this._triangle.contains(this.toLocals(point));
    };
    TriangleField.prototype.containsLocalPoint = function (point) {
        return this._triangle.contains(point);
    };
    TriangleField.prototype.reachesBottomLevel = function (ball) {
        var localBallPosition = this.toLocals(ball.position);
        var ballRadius = ball.radius;
        return this._triangle.getBottomDistance(localBallPosition) < ballRadius;
    };
    TriangleField.prototype.getWidthOnDistance = function (bottomDistance) {
        return this._triangle.getWidthOnDistance(bottomDistance);
    };
    TriangleField.prototype.getWidthOnRelativeDistance = function (relativeDistance) {
        return this._triangle.getWidthOnDistance(relativeDistance * this._triangle.height);
    };
    TriangleField.prototype.draw = function (canvas) {
        var context = canvas.getContext("2d");
        var points = this.getPointArray();
        context.beginPath();
        for (var i = 0; i != points.length; ++i) {
            if (i === 0) {
                context.moveTo(points[i][0], points[i][1]);
            }
            else {
                context.lineTo(points[i][0], points[i][1]);
            }
        }
        context.closePath();
        var fillStyle = null;
        if (this.isNeutral()) {
            fillStyle = 'white';
        }
        else if (this.isLoser()) {
            fillStyle = 'blue';
        }
        else {
            fillStyle = 'red';
        }
        context.fillStyle = fillStyle;
        context.fill();
        context.lineWidth = 1;
        context.stroke();
    };
    return TriangleField;
}(game_component_1.GameComponent));
TriangleField.idGenerator = id_generator_1.getIdGenerator();
exports.TriangleField = TriangleField;
//# sourceMappingURL=triangle_field.js.map