

export class Context {
    private static _locator = new Context();
    private _services: {};
    private _dataSources: {};

    private constructor() {
        this._services = {};
        this._dataSources = {};
    }

    static getInstance(): Context {
        return Context._locator;
    }

    addService(key: string, val: any) {
        if (!(key in this._services)) {
            this._services[key] = val;
        }
    }

    addDataSource(key: string, val: any) {
        if (!(key in this._dataSources)) {
            this._dataSources[key] = val;
        }
    }

    getService(key: string): any {
        return this._services[key];
    }

    getDataSource(key: string): any {
        return this._dataSources[key];
    }
}