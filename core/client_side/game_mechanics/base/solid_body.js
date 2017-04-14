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
var coordinate_system_1 = require("./coordinate_system");
var SolidBody = (function (_super) {
    __extends(SolidBody, _super);
    function SolidBody(origin, angle, velocity, angularVelocity) {
        if (origin === void 0) { origin = [0, 0]; }
        if (angle === void 0) { angle = 0; }
        if (velocity === void 0) { velocity = [0, 0]; }
        if (angularVelocity === void 0) { angularVelocity = 0; }
        var _this = _super.call(this, origin, angle) || this;
        _this._velocity = velocity || [0, 0];
        _this._angularVelocity = angularVelocity || 0;
        return _this;
    }
    Object.defineProperty(SolidBody.prototype, "velocity", {
        get: function () {
            return this._velocity.slice();
        },
        set: function (velocity) {
            if (velocity) {
                this._velocity = velocity;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SolidBody.prototype, "angularVelocity", {
        get: function () {
            return this._angularVelocity;
        },
        set: function (_angularVelocity) {
            this._angularVelocity = _angularVelocity;
        },
        enumerable: true,
        configurable: true
    });
    return SolidBody;
}(coordinate_system_1.CoordinateSystem));
exports.SolidBody = SolidBody;
//# sourceMappingURL=solid_body.js.map