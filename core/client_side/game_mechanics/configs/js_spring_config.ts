'use strict';

import {InputController} from "../event_system/input_controller";
import {EventBus} from "../event_system/event_bus";


export const config = {
    serviceInfo: [
        {
            cls: InputController
        },

        {
            cls: EventBus
        }
    ],

    dataSources: {}
}

/*
export const config = [
    {
        cls: InputController
    },

    {
        cls: EventBus
    }
];
    */