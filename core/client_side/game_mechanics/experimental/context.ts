'use strict';


export interface IContext {
    get(key: string): any;
    set(key: string, val: any): void;
    remove(key: string): any;
}


export abstract class AbstractContext implements IContext {
    private _map: {} = {};

    public get(key: string): any {
        return this._map[key];
    }

    public set(key: string, val: any): void {
        this._map[key] = val;
    }

    public remove(key: string): any {
        const result = this._map[key];
        this._map[key] = null;
        return result;
    }

    public contains(key: string): boolean {
        return (key in this._map);
    }
}


export class VariableContext extends AbstractContext {}


export class ConfigContext extends AbstractContext {
    private static _context = new ConfigContext();

    public static getInstance(): ConfigContext {
        return ConfigContext._context;
    }
}


export class ServiceContext extends AbstractContext {
    private static _context = new ServiceContext();

    public static getInstance(): ServiceContext {
        return ServiceContext._context;
    }
}
