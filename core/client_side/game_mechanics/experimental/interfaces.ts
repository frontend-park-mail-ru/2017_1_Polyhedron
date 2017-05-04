'use strict';

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


export interface Area {
    containsGlobalPoint(point: number[]): boolean;
}


export interface Polygon {
    getPointArray(): number[][];
}
