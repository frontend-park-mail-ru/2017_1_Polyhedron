'use strict';

import {Autowired} from "../experimental/decorators";
import {EventBus} from "../event_system/event_bus";
import {gameEvents} from "../event_system/events";
import DrawEvent = gameEvents.DrawEvent;

export class Drawer {
    protected _canvas: HTMLCanvasElement;
    @Autowired(EventBus)
    protected _eventBus;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._setListeners();
    }

    protected _setListeners() {
        this._eventBus.addEventListener(DrawEvent.eventName, event => event.detail(this._canvas));
    }
}
