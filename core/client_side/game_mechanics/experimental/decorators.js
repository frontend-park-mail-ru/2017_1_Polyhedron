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
var service_1 = require("./service");
function getClassConfigName(constructor) {
    return constructor.name + '.config';
}
function Service(constructor) {
    return (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.toString = function () {
            return constructor.name;
        };
        return class_1;
    }(constructor));
}
exports.Service = Service;
function Autowired(constructFunc) {
    var locator = service_1.Context.getInstance();
    if (!locator.contains(String(constructFunc))) {
        locator.add(constructFunc.name, new constructFunc());
    }
    return function (target, key) {
        target[key] = locator.getService(constructFunc.name);
    };
}
exports.Autowired = Autowired;
function Configurable(config, path) {
    var pathItems = path ? path.split('/') : [];
    var localConfig = pathItems.reduce(function (subConfig, key) { return subConfig[key]; }, config);
    return function (constructor) {
        var locator = service_1.Context.getInstance();
        var configName = getClassConfigName(constructor);
        if (!locator.contains(configName)) {
            locator.add(configName, localConfig);
        }
        return (function (_super) {
            __extends(class_2, _super);
            function class_2() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.apply(this, args) || this;
                _this.config = locator.getService(configName);
                return _this;
            }
            return class_2;
        }(constructor));
    };
}
exports.Configurable = Configurable;
/*
export function Initializable<T extends Constructible> (constructor: T) {
    console.log('Initializable called');
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
            constructor.prototype.init();
        }
    };
}
*/
function FromConfig(name) {
    var locator = service_1.Context.getInstance();
    return function (target, key, descriptor) {
        if (!target[key]) {
            descriptor.get = function () {
                var config = locator.getService(getClassConfigName(target.constructor));
                var propName = name || key;
                return config[propName];
                //target[key] = config[propName];
            };
        }
    };
}
exports.FromConfig = FromConfig;
//# sourceMappingURL=decorators.js.map