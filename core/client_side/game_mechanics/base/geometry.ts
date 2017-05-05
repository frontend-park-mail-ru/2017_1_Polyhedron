'use strict';
import * as math from './../../../_lib/math';
import {Polygon, Area} from '../experimental/interfaces';
import {Vector} from "./common";


export function move(vector: Vector, offset: Vector) {
    return math.add(move, offset);
}


export function getProjectionMatrix(normVec: Vector): number[][] {
    // TODO find error
    const [nx, ny] = math.divide(normVec, math.norm(normVec));

    return [
        [nx * nx, nx * ny],
        [nx * ny, ny * ny]
    ];
}

export function getReflectionMatrix(normVec: Vector) {
    const normVec0 = math.divide(normVec, math.norm(normVec));

    const normMatrix = [
        [normVec0[0] * normVec0[0], normVec0[0] * normVec0[1]],
        [normVec0[0] * normVec0[1], normVec0[1] * normVec0[1]]
    ];

    const identityMatrix = math.eye(2);
    return math.subtract(identityMatrix, math.multiply(normMatrix, 2));
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
    return (offset: number[]) => {
        return polygon.getPointArray()
            .map(point => math.add(point, offset))
            .map(point => area.containsGlobalPoint(point))
            .reduce((curr, next) => curr && next, true);
    };
}
