'use strict';

import {InputController} from "../event_system/input_controller";
import {EventBus} from "../event_system/event_bus";
import {WSEndpoint} from "../network/endpoint";

export const services = [
    InputController,
    EventBus,
    WSEndpoint
];