'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var math = require("../../../_lib/math");
var decorators_1 = require("../experimental/decorators");
var config_1 = require("../config");
var Bot = (function () {
    function Bot(platform, ball, velocity, time) {
        this._platform = platform;
        this._ball = ball;
        this._velocity = velocity;
        this._time = time;
        this._setIntervalID = null;
        this.init();
    }
    Object.defineProperty(Bot.prototype, "velocity", {
        get: function () {
            return this._velocity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bot.prototype, "time", {
        get: function () {
            return this._time;
        },
        enumerable: true,
        configurable: true
    });
    Bot.prototype.init = function () {
        var _this = this;
        this._setIntervalID = setInterval(function () {
            _this._movePlatform(_this._time);
        }, this._time);
    };
    Bot.prototype._movePlatform = function (time) {
        var offsetVector = math.multiply(this._getOffsetDirection(), this._velocity * time);
        var xOffset = [offsetVector[0], 0];
        var yOffset = [0, offsetVector[1]];
        this._platform.moveByWithConstraints(xOffset);
        this._platform.moveByWithConstraints(yOffset);
    };
    Bot.prototype._getOffsetDirection = function () {
        var ballOffset = this._platform.toLocals(this._ball.position);
        ballOffset[1] = -1; // this line moves all bot platforms to the very bottom of corresponding sectors
        var offsetNorm = math.norm(ballOffset);
        var localDirection = math.divide(ballOffset, offsetNorm);
        return this._platform.toGlobalsWithoutOffset(localDirection);
    };
    return Bot;
}());
__decorate([
    decorators_1.FromConfig('velocity')
], Bot.prototype, "velocity", null);
__decorate([
    decorators_1.FromConfig('time')
], Bot.prototype, "time", null);
Bot = __decorate([
    decorators_1.Configurable(config_1.config, 'bot')
], Bot);
exports.Bot = Bot;
/*
const ball = new Ball(100);
const platform = new Platform(100, 200);
const bot = new Bot(platform, ball);
console.log(bot.velocity);
*/
//# sourceMappingURL=bot.js.map