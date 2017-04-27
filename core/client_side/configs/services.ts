'use strict';

import {InputController} from "../game_mechanics/event_system/input_controller";
import {EventBus} from "../game_mechanics/event_system/event_bus";
import {WSEndpoint} from "../game_mechanics/network/endpoint";

export const services = [
    InputController,
    EventBus,
    WSEndpoint
];