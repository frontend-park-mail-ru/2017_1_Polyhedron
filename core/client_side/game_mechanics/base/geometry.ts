'use strict';
import * as math from './../../../_lib/math';
import {Polygon, Area} from '../experimental/interfaces';


export function move(vector: number[], offset: number[]) {
    return math.add(move, offset);
}


export function getRotationMatrix(angle: number): number[][] {
    return math.matrix([
        [Math.cos(angle), Math.sin(angle)],
        [-Math.sin(angle), Math.cos(angle)]
    ]);
}

export function getInverseRotationMatrix(angle: number): number[][] {
    return math.matrix([
        [Math.cos(angle), -Math.sin(angle)],
        [Math.sin(angle), Math.cos(angle)]
    ]);
}


export function rotate(vector: number[], angle: number, origin: number[] = [0, 0]) {
    const offset = math.subtract(vector, origin);
    const newOffset = math.multiply(getInverseRotationMatrix(angle), offset);
    return math.add(origin, newOffset).toArray();
}


export function scale(vector: number[], scaleFactor: number, origin: number[] = [0, 0]) {
    const offset = math.subtract(vector, origin);
    const newOffset = math.multiply(offset, scaleFactor);
    return math.add(origin, newOffset);
}


export function getOffsetChecker(polygon: Polygon, area: Area) {
    return function (offset: number[]) {
        return polygon.getPointArray()
            .map(point => math.add(point, offset))
            .map(point => area.containsGlobalPoint(point))
            .reduce((curr, next) => curr && next, true);
    }
}
