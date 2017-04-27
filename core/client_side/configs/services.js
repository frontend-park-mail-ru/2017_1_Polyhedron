'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var input_controller_1 = require("../game_mechanics/event_system/input_controller");
var event_bus_1 = require("../game_mechanics/event_system/event_bus");
var endpoint_1 = require("../game_mechanics/network/endpoint");
exports.services = [
    input_controller_1.InputController,
    event_bus_1.EventBus,
    endpoint_1.WSEndpoint
];
//# sourceMappingURL=services.js.map