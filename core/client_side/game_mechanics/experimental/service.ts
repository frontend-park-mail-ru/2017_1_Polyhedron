

export class ServiceLocator {
    private static _locator = new ServiceLocator();
    private _serviceInstances: {};

    private constructor() {
        this._serviceInstances = {};
    }

    static getInstance(): ServiceLocator {
        return ServiceLocator._locator;
    }

    add(key: string, val: any) {
        if (!(key in this._serviceInstances)) {
            this._serviceInstances[key] = val;
        }
    }

    contains(key: string): boolean {
        return key in this._serviceInstances;
    }

    getService(key: string): any {
        return this._serviceInstances[key];
    }
}


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