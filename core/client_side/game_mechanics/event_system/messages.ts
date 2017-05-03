'use strict';

import {Point, Vector} from "../base/base_types";


export interface BallState {
    position: Point;
    velocity: Vector;
}


export interface PlatformState {
    id: number;
    position: Point;
    angle: number;
    velocity: Vector;
    isActive: boolean;
}


export interface GameWorldState {
    ballState: BallState;
    platformsState: PlatformState[];
}
