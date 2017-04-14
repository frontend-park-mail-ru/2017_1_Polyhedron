'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var EventBus = (function () {
    function EventBus() {
        this._listeners = {};
    }
    EventBus.prototype.addEventListener = function (eventName, listener) {
        if (!this._listeners[eventName]) {
            this._listeners[eventName] = [listener];
        }
        else {
            this._listeners[eventName].push(listener);
        }
    };
    EventBus.prototype.dispatchEvent = function (event) {
        var listeners = this._listeners[event.constructor.eventName];
        if (listeners) {
            listeners.forEach(function (callback) { return callback(event); });
        }
    };
    return EventBus;
}());
exports.EventBus = EventBus;
//# sourceMappingURL=event_bus.js.map