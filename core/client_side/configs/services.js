'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const input_controller_1 = require("../game_mechanics/event_system/input_controller");
const event_bus_1 = require("../game_mechanics/event_system/event_bus");
const endpoint_1 = require("../game_mechanics/network/endpoint");
const context_1 = require("../game_mechanics/experimental/context");
exports.services = [
    context_1.VariableMap,
    input_controller_1.InputController,
    event_bus_1.EventBus,
    endpoint_1.WSEndpoint
];
//# sourceMappingURL=services.js.map