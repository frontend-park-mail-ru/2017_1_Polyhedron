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
var solid_body_1 = require("./solid_body");
var GameComponent = (function (_super) {
    __extends(GameComponent, _super);
    function GameComponent(anchor, positionValidator) {
        if (anchor === void 0) { anchor = [0, 0]; }
        if (positionValidator === void 0) { positionValidator = function () { return true; }; }
        var _this = _super.call(this) || this;
        _this._anchor = anchor;
        _this._positionValidator = positionValidator;
        return _this;
    }
    Object.defineProperty(GameComponent.prototype, "anchor", {
        get: function () {
            return this._anchor;
        },
        set: function (value) {
            this._anchor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameComponent.prototype, "positionValidator", {
        get: function () {
            return this._positionValidator;
        },
        set: function (value) {
            this._positionValidator = value;
        },
        enumerable: true,
        configurable: true
    });
    GameComponent.prototype.scale = function (scaleFactor) {
        this.shape.scale(scaleFactor);
    };
    GameComponent.prototype.moveToWithConstraints = function (newPosition) {
        if (this._positionValidator(newPosition)) {
            this.moveTo(newPosition);
        }
    };
    GameComponent.prototype.moveByWithConstraints = function (offsetVec, velocityVector) {
        if (this._positionValidator(offsetVec)) {
            this.moveBy(offsetVec);
            this.velocity = velocityVector;
        }
        else {
            this.velocity = [0, 0];
        }
    };
    return GameComponent;
}(solid_body_1.SolidBody));
exports.GameComponent = GameComponent;
//# sourceMappingURL=game_component.js.map