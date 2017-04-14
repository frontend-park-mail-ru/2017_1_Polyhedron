'use strict';
import {Service} from "../experimental/decorators";

@Service
export class EventBus {
    private _listeners: {} = {};

    addEventListener(eventName, listener) {
        if (!this._listeners[eventName]) {
            this._listeners[eventName] = [listener];
        } else {
            this._listeners[eventName].push(listener)
        }
    }

    dispatchEvent(event) {
        const listeners =this._listeners[event.constructor.eventName];
        if (listeners) {
            listeners.forEach(callback => callback(event));
        }
    }
}
