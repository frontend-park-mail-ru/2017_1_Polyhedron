'use strict';

import set = Reflect.set;


export class VariableMap {
    private _map: {};

    constructor() {
        this._map = {};
    }

    public getVariable(key: string) {
        return this._map[key];
    }

    public setVariable(key: string, val: any) {
        this._map[key] = val;
    }
}


export class Context {
    private static _locator = new Context();
    private _services: {};
    private _dataSources: {};

    public static getInstance(): Context {
        return Context._locator;
    }

    public addService(key: string, val: any) {
        if (!(key in this._services)) {
            this._services[key] = val;
        }
    }

    public addDataSource(key: string, val: any) {
        if (!(key in this._dataSources)) {
            this._dataSources[key] = val;
        }
    }

    public getService(key: string): any {
        return this._services[key];
    }

    public getDataSource(key: string): any {
        return this._dataSources[key];
    }

    private constructor() {
        this._services = {};
        this._dataSources = {};
    }
}
