'use strict';

import {Triangle} from '../geometry_shapes/triangle';
import {GameComponent} from '../base/game_component';
import {getIdGenerator} from '../common/id_generator'
import {Ball} from "./ball";
import {Drawable} from "../experimental/interfaces";


export class TriangleField extends GameComponent implements Drawable{
    private static idGenerator = getIdGenerator();
    private _triangle: Triangle;
    private _isNeutral: boolean;
    private _isLoser: boolean;
    private _id: number;

    constructor(height: number, sectorAngle: number, isNeutral:boolean) {
        super();
        this._triangle = new Triangle(height, sectorAngle);
        this._isNeutral = isNeutral;
        this._isLoser = false;

        this._id = TriangleField.idGenerator();
    }

    contains(point: number[]): boolean {
        return this._triangle.contains(this.toLocals(point));
    }

    get height(): number {
        return this._triangle.height;
    }

    get halfWidth(): number {
        return this._triangle.halfWidth;
    }

    get id(): number {
        return this._id;
    }

    get shape(): Triangle {
        return this._triangle;
    }

    getPointArray(): number[][] {
        return this._triangle.getPointArray().map(point => this.toGlobals(point));
    }

    getBottomNorm(): number[] {
        return this.toGlobalsWithoutOffset([0, 1]);
    }

    isNeutral(): boolean {
        return this._isNeutral;
    }

    isLoser(): boolean {
        return this._isLoser;
    }

    setLoser(isLoser: boolean = true) {
        this._isLoser = isLoser;
    }

    containsGlobalPoint(point: number[]): boolean {
        return this._triangle.contains(this.toLocals(point));
    }

    containsLocalPoint(point: number[]): boolean {
        return this._triangle.contains(point);
    }

    reachesBottomLevel(ball: Ball): boolean {
        let localBallPosition = this.toLocals(ball.position);
        let ballRadius = ball.radius;

        return this._triangle.getBottomDistance(localBallPosition) < ballRadius;
    }

    getWidthOnDistance(bottomDistance: number): number {
        return this._triangle.getWidthOnDistance(bottomDistance);
    }

    getWidthOnRelativeDistance(relativeDistance: number): number {
        return this._triangle.getWidthOnDistance(relativeDistance * this._triangle.height);
    }

    draw(canvas: HTMLCanvasElement) {
        let context = canvas.getContext("2d");
        let points = this.getPointArray();

        context.beginPath();
        for (let i = 0; i != points.length; ++i) {
            if (i === 0) {
                context.moveTo(points[i][0], points[i][1]);
            } else {
                context.lineTo(points[i][0], points[i][1]);
            }
        }
        context.closePath();

        let fillStyle = null;
        if (this.isNeutral()) {
            fillStyle = 'white';
        } else if (this.isLoser()) {
            fillStyle = 'blue';
        } else {
            fillStyle = 'red';
        }
        context.fillStyle = fillStyle;
        context.fill();
        context.lineWidth = 1;
        context.stroke();
    }
}
