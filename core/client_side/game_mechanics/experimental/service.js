"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Context = (function () {
    function Context() {
        this._serviceInstances = {};
    }
    Context.getInstance = function () {
        return Context._locator;
    };
    Context.prototype.add = function (key, val) {
        if (!(key in this._serviceInstances)) {
            this._serviceInstances[key] = val;
        }
    };
    Context.prototype.contains = function (key) {
        return key in this._serviceInstances;
    };
    Context.prototype.getService = function (key) {
        return this._serviceInstances[key];
    };
    return Context;
}());
Context._locator = new Context();
exports.Context = Context;
//# sourceMappingURL=service.js.map