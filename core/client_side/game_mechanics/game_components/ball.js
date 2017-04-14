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
var math = require("../../../_lib/math");
var circle_1 = require("../geometry_shapes/circle");
var game_component_1 = require("../base/game_component");
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball(radius) {
        var _this = _super.call(this) || this;
        _this._circle = new circle_1.Circle(radius);
        return _this;
    }
    Object.defineProperty(Ball.prototype, "radius", {
        get: function () {
            return this._circle.radius;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ball.prototype, "shape", {
        get: function () {
            return this._circle;
        },
        enumerable: true,
        configurable: true
    });
    Ball.prototype.bounceNorm = function (normVec, _transportVelocity) {
        if (_transportVelocity === void 0) { _transportVelocity = [0, 0]; }
        var transportVelocity = math.multiply(_transportVelocity, -1);
        var bounceMatrix = this._getBounceMatrix(normVec);
        var relVelocity = math.subtract(this.velocity, transportVelocity);
        debugger;
        this.velocity = math.add(transportVelocity, math.multiply(bounceMatrix, relVelocity)).toArray();
    };
    Ball.prototype.bouncePoint = function (point, transportVelocity) {
        this.bounceNorm(math.subtract(this.position, point), transportVelocity);
    };
    Ball.prototype._getBounceMatrix = function (normVec) {
        var normVec0 = math.divide(normVec, math.norm(normVec));
        var normMatrix = [
            [normVec0[0] * normVec0[0], normVec0[0] * normVec0[1]],
            [normVec0[0] * normVec0[1], normVec0[1] * normVec0[1]]
        ];
        var identityMatrix = math.eye(2);
        return math.subtract(identityMatrix, math.multiply(normMatrix, 2));
    };
    Ball.prototype.draw = function (canvas) {
        var context = canvas.getContext("2d");
        var position = this.position;
        context.beginPath();
        context.arc(position[0], position[1], this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'green';
        context.fill();
        context.lineWidth = 1;
        context.stroke();
    };
    return Ball;
}(game_component_1.GameComponent));
exports.Ball = Ball;
//# sourceMappingURL=ball.js.map