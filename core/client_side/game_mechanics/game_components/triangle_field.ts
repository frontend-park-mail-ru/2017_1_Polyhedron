'use strict';

import {Triangle} from '../geometry_shapes/triangle';
import {GameComponent} from '../base/game_component';
import {getIdGenerator} from '../../../common/id_generator';
import {Ball} from "./ball";
import {Drawable} from "../experimental/interfaces";


export class TriangleField extends GameComponent implements Drawable {
    private static idGenerator = getIdGenerator();
    private _triangle: Triangle;
    private _isNeutral: boolean;
    private _isLoser: boolean;
    private _id: number;

    constructor(height: number, sectorAngle: number, isNeutral: boolean) {
        super();
        this._triangle = new Triangle(height, sectorAngle);
        this._isNeutral = isNeutral;
        this._isLoser = false;

        this._id = TriangleField.idGenerator();
    }

    public contains(point: number[]): boolean {
        return this._triangle.contains(this.toLocals(point));
    }

    public get height(): number {
        return this._triangle.height;
    }

    public get halfWidth(): number {
        return this._triangle.halfWidth;
    }

    public get id(): number {
        return this._id;
    }

    public get shape(): Triangle {
        return this._triangle;
    }

    public getPointArray(): number[][] {
        return this._triangle.getPointArray().map(point => this.toGlobals(point));
    }

    public getBottomNorm(): number[] {
        return this.toGlobalsWithoutOffset([0, 1]);
    }

    public isNeutral(): boolean {
        return this._isNeutral;
    }

    public isLoser(): boolean {
        return this._isLoser;
    }

    public setLoser(isLoser: boolean = true) {
        this._isLoser = isLoser;
    }

    public containsGlobalPoint(point: number[]): boolean {
        return this._triangle.contains(this.toLocals(point));
    }

    public containsLocalPoint(point: number[]): boolean {
        return this._triangle.contains(point);
    }

    public isInSector(globalPoint: number[]): boolean {
        return this._triangle.isInSector(this.toLocals(globalPoint));
    }

    public reachesBottomLevel(ball: Ball): boolean {
        const localBallPosition = this.toLocals(ball.position);
        const ballRadius = ball.radius;

        return this._triangle.getBottomDistance(localBallPosition) < ballRadius;
    }

    public getWidthOnDistance(bottomDistance: number): number {
        return this._triangle.getWidthOnDistance(bottomDistance);
    }

    public getWidthOnRelativeDistance(relativeDistance: number): number {
        return this._triangle.getWidthOnDistance(relativeDistance * this._triangle.height);
    }

    public draw(canvas: HTMLCanvasElement) {
        const context = canvas.getContext("2d");
        const points = this.getPointArray();

        context.beginPath();
        for (let i = 0; i !== points.length; ++i) {
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
