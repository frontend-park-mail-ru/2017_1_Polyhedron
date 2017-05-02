'use strict';
import {Service} from "../experimental/decorators";

@Service
export class EventBus {
    private _listeners: {} = {};

    public addEventListener(eventName, listener) {
        if (!this._listeners[eventName]) {
            this._listeners[eventName] = [listener];
        } else {
            this._listeners[eventName].push(listener);
        }
    }

    public dispatchEvent(event) {
        const listeners = this._listeners[event.type];
        if (listeners) {
            listeners.forEach(callback => callback(event));
        }
    }
}
