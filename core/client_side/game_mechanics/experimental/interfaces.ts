

export interface Scalable {
    rescale(scaleFactor: number);
}


export interface Serializable<T> {
    getState(): T;
    setState(state: T): void;
}


export interface NamedConstructible {
    name?: string;
    new(...args: any[]): {};
}


export interface Constructible {
    new(...args: any[]): {};
}


interface ServiceInfo {
    cls: NamedConstructible;
    args?: any[];
}


export interface ContextConfig {
    services?: ServiceInfo[];
    dataSources?: {};
}


export interface Area {
    containsGlobalPoint(point: number[]): boolean;
}


export interface Polygon {
    getPointArray(): number[][];
}
