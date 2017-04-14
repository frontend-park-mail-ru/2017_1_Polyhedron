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
/**
 * NEVER create instances of BaseEvent class with new. ALWAYS use classname.create(...).
 */
var BaseEvent = (function () {
    function BaseEvent() {
        throw new Error('NEVER create instances of BaseEvent class with new. ALWAYS use classname.create(...).');
    }
    Object.defineProperty(BaseEvent, "eventName", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    BaseEvent.create = function (eventDetail) {
        return new CustomEvent(this._name, {
            detail: eventDetail,
        });
    };
    return BaseEvent;
}());
exports.BaseEvent = BaseEvent;
var PlatformMovedEvent = (function (_super) {
    __extends(PlatformMovedEvent, _super);
    function PlatformMovedEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PlatformMovedEvent;
}(BaseEvent));
exports.PlatformMovedEvent = PlatformMovedEvent;
var BallPositionCorrectionEvent = (function (_super) {
    __extends(BallPositionCorrectionEvent, _super);
    function BallPositionCorrectionEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BallPositionCorrectionEvent;
}(BaseEvent));
exports.BallPositionCorrectionEvent = BallPositionCorrectionEvent;
var DefeatEvent = (function (_super) {
    __extends(DefeatEvent, _super);
    function DefeatEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefeatEvent.create = function (eventDetail) {
        var playerIndex = eventDetail.playerIndex;
        var looserIndex = eventDetail.looserIndex;
        return new CustomEvent(this._name, {
            detail: looserIndex - playerIndex
        });
    };
    return DefeatEvent;
}(BaseEvent));
exports.DefeatEvent = DefeatEvent;
var ClientDefeatEvent = (function (_super) {
    __extends(ClientDefeatEvent, _super);
    function ClientDefeatEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ClientDefeatEvent;
}(BaseEvent));
exports.ClientDefeatEvent = ClientDefeatEvent;
var EnemyPositionCorrectionEvent = (function (_super) {
    __extends(EnemyPositionCorrectionEvent, _super);
    function EnemyPositionCorrectionEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EnemyPositionCorrectionEvent.create = function (eventDetail) {
        var playerIndex = eventDetail.playerIndex;
        var enemyIndex = eventDetail.enemyIndex;
        var offset = eventDetail.offset;
        return new CustomEvent(this._name, {
            detail: {
                index: enemyIndex - playerIndex,
                offset: offset
            }
        });
    };
    return EnemyPositionCorrectionEvent;
}(BaseEvent));
exports.EnemyPositionCorrectionEvent = EnemyPositionCorrectionEvent;
var WorldUpdateEvent = (function (_super) {
    __extends(WorldUpdateEvent, _super);
    function WorldUpdateEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WorldUpdateEvent.create = function (eventDetail) {
        var detail = {
            platformsUpdate: [],
            ballUpdate: {}
        };
        detail.platformsUpdate = eventDetail.platformsUpdate.map(function (platformUpdate) {
            return {
                index: platformUpdate.index - eventDetail.playerIndex,
                position: platformUpdate.position
            };
        });
        detail.ballUpdate = eventDetail.ballUpdate;
        return new CustomEvent(this._name, {
            detail: detail
        });
    };
    return WorldUpdateEvent;
}(BaseEvent));
exports.WorldUpdateEvent = WorldUpdateEvent;
var ServerMessageEvent = (function (_super) {
    __extends(ServerMessageEvent, _super);
    function ServerMessageEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ServerMessageEvent;
}(BaseEvent));
exports.ServerMessageEvent = ServerMessageEvent;
var ClientMessageEvent = (function (_super) {
    __extends(ClientMessageEvent, _super);
    function ClientMessageEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ClientMessageEvent;
}(BaseEvent));
exports.ClientMessageEvent = ClientMessageEvent;
var ConnectionClosedEvent = (function (_super) {
    __extends(ConnectionClosedEvent, _super);
    function ConnectionClosedEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ConnectionClosedEvent;
}(BaseEvent));
exports.ConnectionClosedEvent = ConnectionClosedEvent;
var ServerErrorEvent = (function (_super) {
    __extends(ServerErrorEvent, _super);
    function ServerErrorEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ServerErrorEvent;
}(BaseEvent));
exports.ServerErrorEvent = ServerErrorEvent;
var BallBounced = (function (_super) {
    __extends(BallBounced, _super);
    function BallBounced() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BallBounced;
}(BaseEvent));
exports.BallBounced = BallBounced;
//# sourceMappingURL=events.js.map