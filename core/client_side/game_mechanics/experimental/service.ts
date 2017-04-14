

export class Context {
    private static _locator = new Context();
    private _serviceInstances: {};

    private constructor() {
        this._serviceInstances = {};
    }

    static getInstance(): Context {
        return Context._locator;
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