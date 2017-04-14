"use strict";
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
var game_component_1 = require("../base/game_component");
var rectangle_1 = require("../geometry_shapes/rectangle");
var line_1 = require("../geometry_shapes/line");
var math = require("../../../_lib/math");
var id_generator_1 = require("../common/id_generator");
var DEFAULT_RELATIVE_DISTANCE = 0.05;
var DEFAULT_RELATIVE_LENGTH = 0.3;
var DEFAULT_WIDTH = 5;
var Platform = (function (_super) {
    __extends(Platform, _super);
    function Platform(length, width, isActive) {
        if (isActive === void 0) { isActive = false; }
        var _this = _super.call(this) || this;
        _this._rectangle = new rectangle_1.Rectangle(length, width);
        _this._isActive = isActive;
        _this.id = Platform.generateId();
        return _this;
    }
    Platform.platformFromTriangleField = function (triangleField, _relativeDistance, _relativeLength, _width) {
        var relativeDistance = _relativeDistance || DEFAULT_RELATIVE_DISTANCE;
        var relativeLength = _relativeLength || DEFAULT_RELATIVE_LENGTH;
        var width = _width || DEFAULT_WIDTH;
        var position = triangleField.toGlobals([0, -triangleField.height * (1 - relativeDistance)]); // using such
        // coordinates because triangleField coordinate system origin is in the topmost corner.
        var rotation = triangleField.rotation;
        var totalLength = triangleField.getWidthOnRelativeDistance(relativeDistance);
        var platformLength = totalLength * relativeLength;
        var platform = new Platform(platformLength, width);
        platform.moveTo(position);
        platform.rotateTo(rotation);
        var offsetValidator = function (globalOffsetVec) {
            return platform.getPointArray()
                .map(function (_a) {
                var x = _a[0], y = _a[1];
                return [x + globalOffsetVec[0], y + globalOffsetVec[1]];
            })
                .map(function (point) { return triangleField.contains(point); })
                .reduce(function (res, curr) { return res && curr; }, true);
        };
        platform.anchor = platform.position.slice();
        platform.positionValidator = offsetValidator;
        return platform;
    };
    Platform.prototype.setActive = function () {
        this._isActive = true;
    };
    Platform.prototype.setPassive = function () {
        this._isActive = false;
    };
    Platform.prototype.getPointArray = function () {
        var _this = this;
        return this._rectangle.getPointArray().map(function (point) { return _this.toGlobals(point); });
    };
    Platform.prototype.getLineArray = function () {
        var _this = this;
        var pointArray = this._rectangle.getPointArray().map(function (point) { return _this.toGlobals(point); });
        var indArray = pointArray.map(function (_, index) { return index; });
        //const indArray = [...Array(pointArray.length).keys()];
        var pointPairArray = indArray
            .map(function (i) { return [pointArray[i % pointArray.length], pointArray[(i + 1) % pointArray.length]]; });
        return pointPairArray.map(function (pointPair) { return new line_1.Line(pointPair[0], pointPair[1]); });
    };
    Object.defineProperty(Platform.prototype, "shape", {
        get: function () {
            return this._rectangle;
        },
        enumerable: true,
        configurable: true
    });
    Platform.prototype.getNorm = function () {
        return this.toGlobalsWithoutOffset([0, 1]);
    };
    Platform.prototype.getBouncePoint = function (ball) {
        var lineArray = this.getLineArray();
        var points = lineArray
            .map(function (line) { return line.getClosestPoint(ball.position); })
            .map(function (point) {
            return {
                point: point,
                distance: math.norm(math.subtract(point, ball.position))
            };
        })
            .filter(function (obj) { return obj.distance <= ball.radius; })
            .sort(function (obj1, obj2) { return obj1.distance - obj2.distance; })
            .map(function (obj) { return obj.point; });
        return points.length === 0 ? null : points[0];
    };
    Platform.prototype.draw = function (canvas) {
        var context = canvas.getContext("2d");
        var points = this.getPointArray();
        context.beginPath();
        context.moveTo(points[0][0], points[0][1]);
        for (var i = 1; i != points.length; ++i) {
            context.lineTo(points[i][0], points[i][1]);
        }
        context.closePath();
        context.fillStyle = this._isActive ? 'green' : 'blue';
        context.fill();
        context.lineWidth = 1;
        context.stroke();
    };
    return Platform;
}(game_component_1.GameComponent));
Platform.generateId = id_generator_1.getIdGenerator();
exports.Platform = Platform;
//# sourceMappingURL=platform.js.map